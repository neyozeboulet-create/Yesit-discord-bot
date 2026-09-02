const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('kick').setDescription('Expulser un membre').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.KickMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const raison=interaction.options.getString('raison')||'Aucune raison';
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(!member) return interaction.reply({embeds:[require('../utils/embeds').error('Introuvable','Membre non trouvé')],ephemeral:true});
  const chk=require('../utils/permissions').canModerate(interaction, member, require('../utils/permissions').PermissionFlagsBits.KickMembers);
  if(!chk.ok) return interaction.reply({embeds:[require('../utils/embeds').error('Action refusée', chk.reason)],ephemeral:true});
  await member.kick(raison).catch(e=>null);
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'kick',target_id:user.id,moderator_id:interaction.user.id,reason:raison});
  await interaction.reply({embeds:[require('../utils/embeds').success('Membre expulsé', `**${user.tag}** kick. Raison : ${raison}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};