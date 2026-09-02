const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('rps').setDescription('Pierre feuille ciseaux').addStringOption(o=>o.setName('choix').setDescription('choix').setRequired(true).addChoices({name:'pierre',value:'pierre'},{name:'feuille',value:'feuille'},{name:'ciseaux',value:'ciseaux'})),
  category: 'Fun',
  async execute(interaction){
    try{ 
  const u=interaction.options.getString('choix');
  const b=['pierre','feuille','ciseaux'][Math.floor(Math.random()*3)];
  const win=(u==='pierre'&&b==='ciseaux')||(u==='feuille'&&b==='pierre')||(u==='ciseaux'&&b==='feuille');
  const draw=u===b;
  await interaction.reply({embeds:[require('../utils/embeds').info('Pierre Feuille Ciseaux', `Toi: ${u} vs Bot: ${b}\n${draw?'Égalité': win?'Tu gagnes':'Tu perds'}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};