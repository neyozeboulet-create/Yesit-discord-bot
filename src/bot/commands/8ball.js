const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('8ball').setDescription('Boule magique').addStringOption(o=>o.setName('question').setDescription('question').setRequired(true)),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const q=interaction.options.getString('question');
  const a=['Oui','Non','Peut-être','Certainement','N y compte pas','Demande plus tard','Très probable','Sans doute'];
  await interaction.reply({embeds:[require('../utils/embeds').info('8ball', `**${q}**\n> ${a[Math.floor(Math.random()*a.length)]}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};