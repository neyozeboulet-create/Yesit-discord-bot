const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ship').setDescription('Compatibilité').addUserOption(o=>o.setName('membre1').setDescription('membre1').setRequired(true)).addUserOption(o=>o.setName('membre2').setDescription('membre2').setRequired(false)),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const a=interaction.options.getUser('membre1');
  const b=interaction.options.getUser('membre2')||interaction.user;
  const pct=Math.floor(Math.random()*101);
  await interaction.reply({embeds:[require('../utils/embeds').info('Ship', `${a} + ${b} = **${pct}%** ${pct>80?'Parfait':'❤'}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};