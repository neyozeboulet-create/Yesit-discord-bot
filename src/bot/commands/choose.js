const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('choose').setDescription('Choisir aléatoirement').addStringOption(o=>o.setName('choix').setDescription('choix').setRequired(true)),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const c=interaction.options.getString('choix').split(',').map(s=>s.trim()).filter(Boolean);
  await interaction.reply({embeds:[require('../utils/embeds').info('Choix', `Je choisis : **${c[Math.floor(Math.random()*c.length)]}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};