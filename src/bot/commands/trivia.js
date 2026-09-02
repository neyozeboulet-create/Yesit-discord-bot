const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('trivia').setDescription('Question trivia'),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const qs=[{q:'Capitale de la France ?', a:'Paris'},{q:'2+2*2 ?', a:'6'},{q:'Langage du bot ?', a:'JavaScript'}];
  const qq=qs[Math.floor(Math.random()*qs.length)];
  await interaction.reply({embeds:[require('../utils/embeds').info('Trivia', qq.q + `\n||Réponse: ${qq.a}||`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};