const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('softban').setDescription('Softban (ban puis unban pour clear)').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.BanMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const raison=interaction.options.getString('raison')||'Softban';
  const m=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(m){ const chk=require('../utils/permissions').canModerate(interaction,m, require('../utils/permissions').PermissionFlagsBits.BanMembers); if(!chk.ok) return interaction.reply({embeds:[require('../utils/embeds').error('Refusé',chk.reason)],ephemeral:true}); }
  await interaction.guild.members.ban(user.id, {deleteMessageDays:1, reason:raison});
  await interaction.guild.members.unban(user.id, 'Softban - unban immédiat');
  await interaction.reply({embeds:[require('../utils/embeds').success('Softban', `${user.tag} softban effectué`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};