const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Bannir un membre').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).addIntegerOption(o=>o.setName('jours').setDescription('jours').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.BanMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const raison=interaction.options.getString('raison')||'Aucune raison';
  const jours=interaction.options.getInteger('jours')||0;
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  const chk=require('../utils/permissions').canModerate(interaction, member, require('../utils/permissions').PermissionFlagsBits.BanMembers);
  if(!chk.ok) return interaction.reply({embeds:[require('../utils/embeds').error('Action refusée', chk.reason)], ephemeral:true});
  await interaction.guild.members.ban(user.id, {deleteMessageDays: jours, reason: raison}).catch(e=>null);
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'ban',target_id:user.id,moderator_id:interaction.user.id,reason:raison});
  await interaction.reply({embeds:[require('../utils/embeds').success('Membre banni', `**${user.tag}** a été banni.\nRaison : ${raison}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};