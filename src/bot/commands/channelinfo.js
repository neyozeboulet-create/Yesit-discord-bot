const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('channelinfo').setDescription('Infos salon').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(false)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const c=interaction.options.getChannel('salon')||interaction.channel;
  const e=require('../utils/embeds').info(`Salon - ${c.name}`, `**ID:** ${c.id}\n**Type:** ${c.type}\n**Sujet:** ${c.topic||'Aucun'}\n**NSFW:** ${c.nsfw?'Oui':'Non'}\n**Créé:** <t:${Math.floor(c.createdTimestamp/1000)}:F>`);
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};