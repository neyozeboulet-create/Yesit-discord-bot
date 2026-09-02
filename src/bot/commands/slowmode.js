const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('slowmode').setDescription('Définir le slowmode').addIntegerOption(o=>o.setName('secondes').setDescription('secondes').setRequired(true)).addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageChannels),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const sec=interaction.options.getInteger('secondes');
  const ch=interaction.options.getChannel('salon')||interaction.channel;
  if(sec<0||sec>21600) return interaction.reply({embeds:[require('../utils/embeds').error('Valeur invalide','0 à 21600 secondes')],ephemeral:true});
  await ch.setRateLimitPerUser(sec);
  await interaction.reply({embeds:[require('../utils/embeds').success('Slowmode', `Salon ${ch} : ${sec}s`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};