const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setlevel').setDescription('Configurer niveaux').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(false)).addStringOption(o=>o.setName('message').setDescription('message').setRequired(false)).addBooleanOption(o=>o.setName('activer').setDescription('activer').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon');
  const msg=interaction.options.getString('message');
  const en=interaction.options.getBoolean('activer');
  const upd={}; if(ch) upd.level_channel=ch.id; if(msg) upd.level_message=msg; if(en!==null) upd.xp_enabled=en?1:0;
  await require('../../database/db').updateGuildConfig(interaction.guild.id, upd);
  await interaction.reply({embeds:[require('../utils/embeds').success('Niveaux configurés', JSON.stringify(upd))]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};