const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setautomod').setDescription('Configurer automod').addStringOption(o=>o.setName('option').setDescription('option').setRequired(true).addChoices({name:'liens',value:'liens'},{name:'invites',value:'invites'},{name:'caps',value:'caps'},{name:'spam',value:'spam'},{name:'mentions',value:'mentions'})).addBooleanOption(o=>o.setName('activer').setDescription('activer').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const opt=interaction.options.getString('option');
  const en=interaction.options.getBoolean('activer');
  const map={liens:'automod_links',invites:'automod_invites',caps:'automod_caps',spam:'automod_spam',mentions:'automod_mentions'};
  await require('../../database/db').updateGuildConfig(interaction.guild.id, {[map[opt]]: en?1:0});
  await interaction.reply({embeds:[require('../utils/embeds').success('AutoMod', `${opt} → ${en?'activé':'désactivé'}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};