const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('embed').setDescription('Créer un embed').addStringOption(o=>o.setName('titre').setDescription('titre').setRequired(true)).addStringOption(o=>o.setName('description').setDescription('description').setRequired(true)).addStringOption(o=>o.setName('couleur').setDescription('couleur').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageMessages),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const t=interaction.options.getString('titre');
  const d=interaction.options.getString('description');
  const c=interaction.options.getString('couleur')||'#5865F2';
  const e=require('../utils/embeds').info(t,d);
  try{ e.setColor(c); }catch{}
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};