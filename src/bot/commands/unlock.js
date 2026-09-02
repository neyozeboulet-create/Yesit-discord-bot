const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('unlock').setDescription('Déverrouiller un salon').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageChannels),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon')||interaction.channel;
  await ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages:null});
  await interaction.reply({embeds:[require('../utils/embeds').success('Salon déverrouillé', `${ch} déverrouillé`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};