const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('unwarn').setDescription('Retirer un avertissement').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addIntegerOption(o=>o.setName('id').setDescription('id').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ModerateMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const id=interaction.options.getInteger('id');
  const {db}=require('../../database/db');
  if(id){ db.run('DELETE FROM warns WHERE id=? AND guild_id=?',[id, interaction.guild.id]); await interaction.reply({embeds:[require('../utils/embeds').success('Warn retiré', `Warn #${id} supprimé`)]}); }
  else { const row=await new Promise(r=> db.get('SELECT id FROM warns WHERE guild_id=? AND user_id=? ORDER BY timestamp DESC LIMIT 1',[interaction.guild.id,user.id],(e,ro)=>r(ro))); if(!row) return interaction.reply({embeds:[require('../utils/embeds').error('Aucun warn','Aucun avertissement trouvé')],ephemeral:true}); db.run('DELETE FROM warns WHERE id=?',[row.id]); await interaction.reply({embeds:[require('../utils/embeds').success('Warn retiré', `Dernier warn de ${user.tag} retiré`)]}); } }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};