const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('gend').setDescription('Terminer un giveaway').addStringOption(o=>o.setName('message_id').setDescription('message_id').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageEvents),
  category: 'Giveaway',
  async execute(interaction){
    try{ 
  const mid=interaction.options.getString('message_id');
  const {db}=require('../../database/db');
  const row=await new Promise(r=> db.get('SELECT * FROM giveaways WHERE message_id=?',[mid],(e,ro)=>r(ro)));
  if(!row) return interaction.reply({embeds:[require('../utils/embeds').error('Introuvable','Giveaway non trouvé')],ephemeral:true});
  db.run('UPDATE giveaways SET ended=1 WHERE message_id=?',[mid]);
  await interaction.reply({embeds:[require('../utils/embeds').success('Giveaway terminé', `Lot ${row.prize} terminé`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};