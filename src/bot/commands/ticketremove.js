const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ticketremove').setDescription('Retirer un membre du ticket').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageChannels),
  category: 'Tickets',
  async execute(interaction){
    try{ 
  const u=interaction.options.getUser('membre');
  await interaction.channel.permissionOverwrites.delete(u.id).catch(()=>{});
  await interaction.reply({embeds:[require('../utils/embeds').success('Retiré', `${u} retiré`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};