const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('roll').setDescription('Lancer un dé').addIntegerOption(o=>o.setName('faces').setDescription('faces').setRequired(false)).addIntegerOption(o=>o.setName('nombre').setDescription('nombre').setRequired(false)),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const faces=interaction.options.getInteger('faces')||6;
  const n=interaction.options.getInteger('nombre')||1;
  if(faces<2||faces>100||n<1||n>10) return interaction.reply({embeds:[require('../utils/embeds').error('Valeur invalide','Faces 2-100, dés 1-10')],ephemeral:true});
  const rolls=Array.from({length:n},()=> Math.floor(Math.random()*faces)+1);
  await interaction.reply({embeds:[require('../utils/embeds').info('Lancer de dés', rolls.join(' , ') + ` (total ${rolls.reduce((a,b)=>a+b,0)})`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};