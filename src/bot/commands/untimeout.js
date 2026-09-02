const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('untimeout').setDescription('Retirer un timeout').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ModerateMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const raison=interaction.options.getString('raison')||'Aucune raison';
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(!member) return interaction.reply({embeds:[require('../utils/embeds').error('Introuvable','Membre non trouvé')],ephemeral:true});
  await member.timeout(null, raison);
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'untimeout',target_id:user.id,moderator_id:interaction.user.id});
  await interaction.reply({embeds:[require('../utils/embeds').success('Timeout retiré', `**${user.tag}** peut à nouveau parler.`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};