const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setgoodbye').setDescription('Configurer départs').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(true)).addStringOption(o=>o.setName('message').setDescription('message').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon');
  const msg=interaction.options.getString('message');
  const upd={goodbye_channel:ch.id}; if(msg) upd.goodbye_message=msg;
  await require('../../database/db').updateGuildConfig(interaction.guild.id, upd);
  await interaction.reply({embeds:[require('../utils/embeds').success('Départs configurés', `Salon: ${ch}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};