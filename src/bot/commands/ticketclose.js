const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ticketclose').setDescription('Fermer le ticket').setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageChannels),
  category: 'Tickets',
  async execute(interaction){
    try{ 
  if(!interaction.channel.name.startsWith('ticket-')) return interaction.reply({embeds:[require('../utils/embeds').error('Pas un ticket','Ce salon n est pas un ticket')],ephemeral:true});
  await interaction.reply({embeds:[require('../utils/embeds').warning('Fermeture','Fermeture dans 3s...')]});
  setTimeout(()=> interaction.channel.delete().catch(()=>{}),3000); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};