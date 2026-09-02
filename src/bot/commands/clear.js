const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Supprimer des messages').addIntegerOption(o=>o.setName('nombre').setDescription('nombre').setRequired(true)).addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageMessages),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const n=interaction.options.getInteger('nombre');
  const member=interaction.options.getUser('membre');
  if(n<1||n>100) return interaction.reply({embeds:[require('../utils/embeds').error('Nombre invalide','1 à 100')],ephemeral:true});
  await interaction.deferReply({ephemeral:true});
  let msgs=await interaction.channel.messages.fetch({limit:n});
  if(member) msgs=msgs.filter(m=>m.author.id===member.id);
  const del=await interaction.channel.bulkDelete(msgs, true).catch(()=>null);
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'clear',moderator_id:interaction.user.id,channel_id:interaction.channel.id, extra:{count: del?.size||0}});
  await interaction.editReply({embeds:[require('../utils/embeds').success('Messages supprimés', `${del?.size||0} messages supprimés`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};