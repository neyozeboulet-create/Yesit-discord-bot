const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('timeout').setDescription('Exclure temporairement').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addIntegerOption(o=>o.setName('duree').setDescription('duree').setRequired(true)).addStringOption(o=>o.setName('unite').setDescription('unite').setRequired(false).addChoices({name:'minutes',value:'minutes'},{name:'heures',value:'heures'},{name:'jours',value:'jours'})).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ModerateMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const duree=interaction.options.getInteger('duree');
  const unite=interaction.options.getString('unite')||'minutes';
  const raison=interaction.options.getString('raison')||'Aucune raison';
  const mult={minutes:60000,heures:3600000,jours:86400000}[unite];
  const ms=duree*mult;
  if(ms<60000||ms>2419200000) return interaction.reply({embeds:[require('../utils/embeds').error('Durée invalide','1 minute à 28 jours')],ephemeral:true});
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  const chk=require('../utils/permissions').canModerate(interaction, member, require('../utils/permissions').PermissionFlagsBits.ModerateMembers);
  if(!chk.ok) return interaction.reply({embeds:[require('../utils/embeds').error('Action refusée', chk.reason)],ephemeral:true});
  await member.timeout(ms, raison);
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'timeout',target_id:user.id,moderator_id:interaction.user.id,reason:raison, extra:{duree: duree+' '+unite}});
  await interaction.reply({embeds:[require('../utils/embeds').success('Timeout appliqué', `**${user.tag}** timeout ${duree} ${unite}. Raison: ${raison}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};