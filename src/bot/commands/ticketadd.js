const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ticketadd').setDescription('Ajouter un membre au ticket').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageChannels),
  category: 'Tickets',
  async execute(interaction){
    try{ 
  if(!interaction.channel.name.startsWith('ticket-')) return interaction.reply({embeds:[require('../utils/embeds').error('Pas un ticket','Salon non ticket')],ephemeral:true});
  const u=interaction.options.getUser('membre');
  await interaction.channel.permissionOverwrites.edit(u.id, {ViewChannel:true, SendMessages:true});
  await interaction.reply({embeds:[require('../utils/embeds').success('Ajouté', `${u} ajouté au ticket`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};