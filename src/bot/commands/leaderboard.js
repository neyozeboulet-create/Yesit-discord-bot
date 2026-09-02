const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Classement niveaux'),
  category: 'Niveaux',
  async execute(interaction){
    try{ 
  const {db}=require('../../database/db');
  const rows=await new Promise(r=> db.all('SELECT id, xp, level FROM users WHERE guild_id=? ORDER BY level DESC, xp DESC LIMIT 10',[interaction.guild.id],(e,rs)=>r(rs||[])));
  if(!rows.length) return interaction.reply({embeds:[require('../utils/embeds').info('Leaderboard','Aucune donnée')],ephemeral:true});
  const desc=await Promise.all(rows.map(async (u,i)=> { const usr=await interaction.client.users.fetch(u.id).catch(()=>({tag:u.id})); return `**${i+1}.** ${usr.tag} - Niveau ${u.level} (${u.xp} XP)`; }));
  await interaction.reply({embeds:[require('../utils/embeds').info('Leaderboard niveaux', desc.join('\n'))]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};