const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('greroll').setDescription('Retirer au sort').addStringOption(o=>o.setName('message_id').setDescription('message_id').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageEvents),
  category: 'Giveaway',
  async execute(interaction){
    try{ 
  const mid=interaction.options.getString('message_id');
  await interaction.reply({embeds:[require('../utils/embeds').info('Reroll', `Nouveau tirage pour ${mid} (simulation)`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};