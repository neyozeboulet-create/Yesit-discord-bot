const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('unban').setDescription('Débannir un utilisateur').addStringOption(o=>o.setName('user_id').setDescription('user_id').setRequired(true)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.BanMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const id=interaction.options.getString('user_id');
  const raison=interaction.options.getString('raison')||'Aucune raison';
  if(!/^[0-9]{17,19}$/.test(id)) return interaction.reply({embeds:[require('../utils/embeds').error('ID invalide','Fournis un ID Discord valide')],ephemeral:true});
  await interaction.guild.members.unban(id, raison).catch(e=> { return interaction.reply({embeds:[require('../utils/embeds').error('Échec', e.message)],ephemeral:true}); });
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'unban',target_id:id,moderator_id:interaction.user.id,reason:raison});
  await interaction.reply({embeds:[require('../utils/embeds').success('Débanni', `ID ${id} débanni. Raison: ${raison}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};