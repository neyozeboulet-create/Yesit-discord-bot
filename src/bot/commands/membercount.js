const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('membercount').setDescription('Compter les membres'),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const g=interaction.guild;
  const total=g.memberCount;
  const bots=g.members.cache.filter(m=>m.user.bot).size;
  const humans=total-bots;
  await interaction.reply({embeds:[require('../utils/embeds').info('Membres', `**Total:** ${total}\n**Humains:** ${humans}\n**Bots:** ${bots}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};