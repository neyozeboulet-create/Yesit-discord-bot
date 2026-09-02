const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Infos bot'),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const c=interaction.client;
  const up=Math.floor(c.uptime/1000);
  const h=Math.floor(up/3600), m=Math.floor((up%3600)/60);
  await interaction.reply({embeds:[require('../utils/embeds').info('Bot', `**Tag:** ${c.user.tag}\n**Serveurs:** ${c.guilds.cache.size}\n**Uptime:** ${h}h ${m}m\n**Ping:** ${c.ws.ping}ms\n**Version:** 2.0`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};