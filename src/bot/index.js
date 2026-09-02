require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getUser, updateUser, getGuildConfig, addLog } = require('../database/db');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();
client.startTime = Date.now();

// Load commands recursively from commands folder
function loadCommands(dir){
  for(const entry of fs.readdirSync(dir, {withFileTypes:true})){
    const full = path.join(dir, entry.name);
    if(entry.isDirectory()) loadCommands(full);
    else if(entry.isFile() && entry.name.endsWith('.js')){
      try{
        const cmd = require(full);
        if(cmd.data && cmd.data.name) client.commands.set(cmd.data.name, cmd);
      }catch(e){ console.error('Failed load', full, e.message); }
    }
  }
}
loadCommands(path.join(__dirname, 'commands'));
console.log(`Loaded ${client.commands.size} commands`);

client.once('clientReady', () => {
  console.log(`Bot pret : ${client.user.tag} | ${client.commands.size} cmds | ${client.guilds.cache.size} guilds`);
  client.user.setActivity('dashboard • /help', { type: 3 });
});

client.on('interactionCreate', async interaction => {
  // Slash commands
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction, client);
      addLog({ guild_id: interaction.guild?.id || 'DM', type: 'command', user_id: interaction.user.id, content: `/${interaction.commandName}`, extra: { options: interaction.options.data } }).catch(()=>{});
    } catch (e) {
      console.error(`[${interaction.commandName}]`, e);
      const errEmbed = new EmbedBuilder().setColor(0xED4245).setTitle('Erreur').setDescription(e.message?.slice(0,1000) || 'Une erreur est survenue');
      if (interaction.replied || interaction.deferred) await interaction.followUp({ embeds: [errEmbed], ephemeral: true }).catch(()=>{});
      else await interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(()=>{});
    }
    return;
  }
  // Buttons - tickets
  if (interaction.isButton()) {
    if (interaction.customId === 'create_ticket') {
      const guild = interaction.guild;
      const existing = guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
      if (existing) return interaction.reply({ content: `Ticket existant : ${existing}`, ephemeral: true });
      const cfg = await getGuildConfig(guild.id);
      const category = cfg.ticket_category ? guild.channels.cache.get(cfg.ticket_category) : null;
      const perms = [
        { id: guild.id, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] }
      ];
      if (cfg.ticket_support_role) perms.push({ id: cfg.ticket_support_role, allow: ['ViewChannel', 'SendMessages'] });
      const channel = await guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        type: 0,
        parent: category?.id || null,
        permissionOverwrites: perms
      });
      const { db } = require('../database/db');
      db.run(`INSERT INTO tickets (guild_id, user_id, channel_id, created_at) VALUES (?,?,?,?)`, [guild.id, interaction.user.id, channel.id, Date.now()]);
      addLog({ guild_id: guild.id, type: 'ticket_create', user_id: interaction.user.id, channel_id: channel.id }).catch(()=>{});
      await channel.send({ embeds: [new EmbedBuilder().setColor(0x5865F2).setTitle('Ticket ouvert').setDescription(`Bienvenue <@${interaction.user.id}> - l equipe va t aider.\nUtilise /ticketclose pour fermer.`)] });
      await interaction.reply({ content: `Ticket cree : ${channel}`, ephemeral: true });
    }
    if (interaction.customId === 'close_ticket') {
      await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xED4245).setTitle('Fermeture').setDescription('Suppression dans 3 secondes')] });
      setTimeout(() => interaction.channel.delete().catch(()=>{}), 3000);
    }
  }
});

// Lightweight message handling for AFK + XP (when intents allow, otherwise no-op)
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  // AFK check - mention
  if (message.mentions.users.size > 0) {
    const { db } = require('../database/db');
    for (const [,u] of message.mentions.users) {
      const afk = await new Promise(r=> db.get('SELECT * FROM afk WHERE user_id=? AND guild_id=?',[u.id, message.guild.id],(e,ro)=>r(ro)));
      if (afk) message.reply({ embeds: [new EmbedBuilder().setColor(0xFFAA00).setDescription(`**${u.tag}** est AFK : ${afk.reason} (<t:${Math.floor(afk.since/1000)}:R>)`)] }).catch(()=>{});
    }
  }
  // Remove AFK if author was AFK
  const { db } = require('../database/db');
  const selfAfk = await new Promise(r=> db.get('SELECT * FROM afk WHERE user_id=? AND guild_id=?',[message.author.id, message.guild.id],(e,ro)=>r(ro)));
  if (selfAfk) {
    db.run('DELETE FROM afk WHERE user_id=? AND guild_id=?',[message.author.id, message.guild.id]);
    message.reply(`Bienvenue de retour ${message.author} - AFK retire.`).catch(()=>{});
    try{ if(message.member) await message.member.setNickname(message.member.displayName.replace(/^\[AFK\]\s*/,'')).catch(()=>{}); }catch{}
  }
});

// Guild events logging
client.on('guildMemberAdd', async member => {
  const cfg = await getGuildConfig(member.guild.id).catch(()=>null);
  if (!cfg) return;
  addLog({ guild_id: member.guild.id, type: 'member_join', user_id: member.id }).catch(()=>{});
  if (cfg.welcome_channel) {
    const ch = member.guild.channels.cache.get(cfg.welcome_channel);
    if (ch) {
      let msg = cfg.welcome_message || 'Bienvenue {user} sur {server} !';
      msg = msg.replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name).replace('{count}', member.guild.memberCount);
      const embed = new EmbedBuilder().setColor(0x2DC770).setTitle('Bienvenue').setDescription(msg).setThumbnail(member.user.displayAvatarURL());
      ch.send({ embeds: [embed] }).catch(()=>{});
    }
  }
  if (cfg.autorole) {
    const role = member.guild.roles.cache.get(cfg.autorole);
    if (role) member.roles.add(role).catch(()=>{});
  }
});

client.on('guildMemberRemove', member => {
  addLog({ guild_id: member.guild.id, type: 'member_leave', user_id: member.id }).catch(()=>{});
});

client.on('messageDelete', msg => {
  if(!msg.guild || msg.author?.bot) return;
  addLog({ guild_id: msg.guild.id, type: 'message_delete', user_id: msg.author.id, channel_id: msg.channel.id, content: msg.content?.slice(0,1000) }).catch(()=>{});
});

client.on('messageUpdate', (oldMsg, newMsg) => {
  if(!newMsg.guild || newMsg.author?.bot || oldMsg.content === newMsg.content) return;
  addLog({ guild_id: newMsg.guild.id, type: 'message_edit', user_id: newMsg.author.id, channel_id: newMsg.channel.id, content: `Avant: ${oldMsg.content?.slice(0,500)}\nAprès: ${newMsg.content?.slice(0,500)}` }).catch(()=>{});
});

client.on('guildBanAdd', ban => addLog({ guild_id: ban.guild.id, type: 'ban', target_id: ban.user.id }).catch(()=>{}));
client.on('guildBanRemove', ban => addLog({ guild_id: ban.guild.id, type: 'unban', target_id: ban.user.id }).catch(()=>{}));

if (!process.env.DISCORD_TOKEN) {
  console.warn('DISCORD_TOKEN manquant');
} else {
  client.login(process.env.DISCORD_TOKEN).catch(e=> console.error('Login fail', e.message));
}

module.exports = client;
