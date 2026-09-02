const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('Infos membre').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(false)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const u=interaction.options.getUser('membre')||interaction.user;
  const m=await interaction.guild.members.fetch(u.id).catch(()=>null);
  const e=require('../utils/embeds').info(`Utilisateur - ${u.tag}`, `**ID:** ${u.id}\n**Créé:** <t:${Math.floor(u.createdTimestamp/1000)}:F>\n**Rejoint:** ${m?'<t:'+Math.floor(m.joinedTimestamp/1000)+':F>':'Inconnu'}\n**Rôles:** ${m? m.roles.cache.map(r=>r.toString()).join(' ') : '—'}`);
  e.setThumbnail(u.displayAvatarURL());
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};