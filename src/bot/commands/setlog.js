const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setlog').setDescription('Définir salon de logs').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(true)).addStringOption(o=>o.setName('type').setDescription('type').setRequired(false).addChoices({name:'mod',value:'mod'},{name:'all',value:'all'})).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon');
  const type=interaction.options.getString('type')||'all';
  await require('../../database/db').updateGuildConfig(interaction.guild.id, type==='mod'?{modlog_channel:ch.id}:{log_channel:ch.id});
  await interaction.reply({embeds:[require('../utils/embeds').success('Logs configurés', `Salon ${type} → ${ch}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};