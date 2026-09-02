const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('lockdown').setDescription('Verrouiller tout le serveur').addBooleanOption(o=>o.setName('activer').setDescription('activer').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Sécurité',
  async execute(interaction){
    try{ 
  const en=interaction.options.getBoolean('activer');
  const g=interaction.guild;
  for(const [,ch] of g.channels.cache.filter(c=>c.isTextBased())){
    try{ await ch.permissionOverwrites.edit(g.roles.everyone, {SendMessages: en?false:null}); }catch{}
  }
  await require('../../database/db').updateGuildConfig(g.id, {raidmode: en?1:0});
  await interaction.reply({embeds:[require('../utils/embeds').warning(en?'Lockdown activé':'Lockdown désactivé', en?'Tous les salons verrouillés':'Salons déverrouillés')]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};