const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('say').setDescription('Faire parler le bot').addStringOption(o=>o.setName('message').setDescription('message').setRequired(true)).addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageMessages),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const m=interaction.options.getString('message');
  const ch=interaction.options.getChannel('salon')||interaction.channel;
  await ch.send(m);
  await interaction.reply({embeds:[require('../utils/embeds').success('Envoyé', `Message envoyé dans ${ch}`)],ephemeral:true}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};