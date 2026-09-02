const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('rate').setDescription('Noter quelque chose').addStringOption(o=>o.setName('chose').setDescription('chose').setRequired(true)),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const c=interaction.options.getString('chose');
  await interaction.reply({embeds:[require('../utils/embeds').info('Note', `${c} → **${Math.floor(Math.random()*11)}/10**`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};