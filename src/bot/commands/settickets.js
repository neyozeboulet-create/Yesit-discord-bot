const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('settickets').setDescription('Configurer tickets').addChannelOption(o=>o.setName('categorie').setDescription('categorie').setRequired(false)).addRoleOption(o=>o.setName('support').setDescription('support').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const cat=interaction.options.getChannel('categorie');
  const role=interaction.options.getRole('support');
  const upd={}; if(cat) upd.ticket_category=cat.id; if(role) upd.ticket_support_role=role.id;
  await require('../../database/db').updateGuildConfig(interaction.guild.id, upd);
  await interaction.reply({embeds:[require('../utils/embeds').success('Tickets configurés', `Catégorie: ${cat||'—'} | Support: ${role||'—'}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};