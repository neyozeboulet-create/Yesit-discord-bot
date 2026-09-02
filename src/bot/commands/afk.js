const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('afk').setDescription('Mode AFK').addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const r=interaction.options.getString('raison')||'AFK';
  const {db}=require('../../database/db');
  db.run('INSERT OR REPLACE INTO afk (user_id,guild_id,reason,since) VALUES (?,?,?,?)',[interaction.user.id, interaction.guild.id, r, Date.now()]);
  try{ await interaction.member.setNickname(`[AFK] ${interaction.member.displayName}`).catch(()=>{}); }catch{}
  await interaction.reply({embeds:[require('../utils/embeds').info('AFK activé', `Tu es maintenant AFK : ${r}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};