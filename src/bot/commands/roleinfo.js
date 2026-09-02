const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('roleinfo').setDescription('Infos rôle').addRoleOption(o=>o.setName('role').setDescription('role').setRequired(true)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const r=interaction.options.getRole('role');
  const e=require('../utils/embeds').info(`Rôle - ${r.name}`, `**ID:** ${r.id}\n**Couleur:** ${r.hexColor}\n**Membres:** ${r.members.size}\n**Position:** ${r.position}\n**Mentionnable:** ${r.mentionable?'Oui':'Non'}\n**Créé:** <t:${Math.floor(r.createdTimestamp/1000)}:F>`);
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};