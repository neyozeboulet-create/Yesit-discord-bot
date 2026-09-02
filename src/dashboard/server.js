require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { db, getGuildConfig, updateGuildConfig, getLogs, addLog } = require('../database/db');
const { REST, Routes } = require('discord.js');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

app.use(helmet({ contentSecurityPolicy:false }));
app.use(cors());
app.use(bodyParser.json({ limit:'200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({ windowMs: 60000, max: 120, standardHeaders:true });
app.use('/api/', limiter);

// Helpers
function validateGuildId(id){ return /^[0-9]{17,19}$/.test(id); }
async function fetchGuildDetails(guildId){
  if(!process.env.DISCORD_TOKEN) return null;
  const rest = new REST({version:'10'}).setToken(process.env.DISCORD_TOKEN);
  try{
    const g = await rest.get(Routes.guild(guildId));
    const channels = await rest.get(Routes.guildChannels(guildId)).catch(()=>[]);
    const roles = await rest.get(Routes.guildRoles(guildId)).catch(()=>[]);
    return { id:g.id, name:g.name, icon:g.icon, memberCount:g.approximate_member_count || null, channels: channels.length, roles: roles.length };
  }catch(e){ return null; }
}

// Public pages
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));
app.get('/dashboard', (req,res)=> res.sendFile(path.join(__dirname,'public','dashboard.html')));
app.get('/server/:id', (req,res)=> res.sendFile(path.join(__dirname,'public','server.html')));
app.get('/commands', (req,res)=> res.sendFile(path.join(__dirname,'public','commands.html')));

// API - bot stats
app.get('/api/stats', async (req,res)=>{
  const rest = new REST({version:'10'}).setToken(process.env.DISCORD_TOKEN);
  let botGuilds = [];
  try{
    // Use guild_config as source of guilds bot has seen
    const rows = await new Promise(r=> db.all('SELECT guild_id FROM guild_config', (e,rs)=> r(rs||[])));
    botGuilds = rows.map(x=>x.guild_id);
  }catch{}
  db.get('SELECT COUNT(*) as users FROM users', (e,r1)=>{
    db.get('SELECT COUNT(*) as logs FROM logs', (e2,r2)=>{
      db.get('SELECT COUNT(*) as tickets FROM tickets WHERE status="open"', (e3,r3)=>{
        res.json({ totalUsers: r1?.users||0, totalLogs: r2?.logs||0, openTickets: r3?.tickets||0, guilds: botGuilds.length, uptime: process.uptime() });
      });
    });
  });
});

app.get('/api/bot/guilds', async (req,res)=>{
  const rows = await new Promise(r=> db.all('SELECT guild_id FROM guild_config', (e,rs)=> r(rs||[])));
  const details = [];
  for(const row of rows){
    const d = await fetchGuildDetails(row.guild_id);
    if(d) details.push({ ...d, inGuild:true });
    else details.push({ id: row.guild_id, name: 'Serveur '+row.guild_id.slice(-4), inGuild:false });
  }
  // Also try to get guilds via REST if DB empty - fallback to current bot guilds via checking known id from env
  if(details.length===0 && process.env.GUILD_ID){
    const d = await fetchGuildDetails(process.env.GUILD_ID);
    if(d) details.push({...d, inGuild:true});
  }
  res.json(details);
});

app.get('/api/guild/:id/overview', async (req,res)=>{
  const id=req.params.id;
  if(!validateGuildId(id)) return res.status(400).json({error:'ID invalide'});
  const cfg = await getGuildConfig(id);
  const details = await fetchGuildDetails(id);
  const stats = await new Promise(resolve=>{
    db.get('SELECT COUNT(*) as members FROM users WHERE guild_id=?',[id], (e,r1)=>{
      db.get('SELECT COUNT(*) as warns FROM warns WHERE guild_id=?',[id], (e2,r2)=>{
        db.get('SELECT COUNT(*) as tickets FROM tickets WHERE guild_id=?',[id], (e3,r3)=>{
          db.all('SELECT type, COUNT(*) as c FROM logs WHERE guild_id=? GROUP BY type',[id], (e4, rows)=>{
            resolve({ members: r1?.members||0, warns: r2?.warns||0, tickets: r3?.tickets||0, logsByType: rows||[] });
          });
        });
      });
    });
  });
  const recentLogs = await getLogs(id, {limit:8});
  res.json({ config: cfg, guild: details, stats, recentLogs });
});

app.get('/api/guild/:id/logs', async (req,res)=>{
  const id=req.params.id;
  if(!validateGuildId(id)) return res.status(400).json({error:'ID invalide'});
  const { type, user, limit=50, offset=0, from, to } = req.query;
  const logs = await getLogs(id, { type: type||null, user: user||null, limit: Math.min(parseInt(limit)||50,100), offset: parseInt(offset)||0, from: from?parseInt(from):null, to: to?parseInt(to):null });
  res.json(logs);
});

app.get('/api/guild/:id/config', async (req,res)=>{
  const id=req.params.id;
  if(!validateGuildId(id)) return res.status(400).json({error:'ID invalide'});
  const cfg = await getGuildConfig(id);
  res.json(cfg);
});

app.put('/api/guild/:id/config', async (req,res)=>{
  const id=req.params.id;
  if(!validateGuildId(id)) return res.status(400).json({error:'ID invalide'});
  const allowed = ['welcome_channel','welcome_message','goodbye_channel','goodbye_message','log_channel','modlog_channel','autorole','auto_mod','xp_enabled','level_channel','level_message','automod_words','automod_links','automod_invites','automod_caps','automod_spam','automod_mentions','starboard_channel','suggestion_channel','antinuke','raidmode','verification_role','ticket_category','ticket_support_role'];
  const fields={};
  for(const k of allowed){ if(req.body[k]!==undefined) fields[k]=req.body[k]; }
  // sanitize
  if(fields.welcome_message && fields.welcome_message.length>1000) return res.status(400).json({error:'Message trop long'});
  if(fields.automod_words){ try{ JSON.parse(fields.automod_words); }catch{ return res.status(400).json({error:'automod_words JSON invalide'}); } }
  // coerce booleans to int
  ['auto_mod','xp_enabled','automod_links','automod_invites','automod_caps','automod_spam','automod_mentions','antinuke','raidmode'].forEach(k=>{ if(fields[k]!==undefined) fields[k]= fields[k]?1:0; });
  await updateGuildConfig(id, fields);
  await addLog({guild_id:id, type:'config_update', user_id:'dashboard', extra: fields}).catch(()=>{});
  res.json({ ok:true });
});

app.get('/api/guild/:id/members', async (req,res)=>{
  const id=req.params.id;
  if(!validateGuildId(id)) return res.status(400).json({error:'ID invalide'});
  const rows = await new Promise(r=> db.all('SELECT id, coins, xp, level, rep, warnings FROM users WHERE guild_id=? ORDER BY level DESC, xp DESC LIMIT 100',[id],(e,rs)=> r(rs||[])));
  res.json(rows);
});

app.get('/api/commands', (req,res)=>{
  const fs=require('fs'); const path=require('path');
  const dir=path.join(__dirname,'../bot/commands');
  const list=[];
  function scan(d){
    for(const e of fs.readdirSync(d,{withFileTypes:true})){
      const full=path.join(d,e.name);
      if(e.isDirectory()) scan(full);
      else if(e.isFile() && e.name.endsWith('.js')){
        try{ const m=require(full); if(m.data) list.push({name:m.data.name, description:m.data.description, category:m.category||'Autre', options: m.data.options||[]}); }catch{}
      }
    }
  }
  scan(dir);
  res.json(list);
});

app.get('/api/bot/invite', (req,res)=>{
  const id=process.env.CLIENT_ID||'';
  res.json({ url: `https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands` });
});

// Fallback
app.use((req,res)=> res.status(404).json({error:'Not found'}));

app.listen(PORT, ()=> console.log(`Dashboard on http://localhost:${PORT}`));
