const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Pile ou face'),
  category: 'Fun',
  async execute(interaction){
    try{ 
  await interaction.reply({embeds:[require('../utils/embeds').info('Pile ou face', Math.random()>0.5?'Pile':'Face')]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};