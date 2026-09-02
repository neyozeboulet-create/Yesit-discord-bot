const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('lock').setDescription('Verrouiller un salon').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(false)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageChannels),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon')||interaction.channel;
  await ch.permissionOverwrites.edit(interaction.guild.roles.everyone, {SendMessages:false});
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'lock',moderator_id:interaction.user.id,channel_id:ch.id});
  await interaction.reply({embeds:[require('../utils/embeds').warning('Salon verrouillé', `${ch} verrouillé`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};