const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setwelcome').setDescription('Configurer bienvenue').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(true)).addStringOption(o=>o.setName('message').setDescription('message').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon');
  const msg=interaction.options.getString('message');
  const upd={welcome_channel:ch.id}; if(msg) upd.welcome_message=msg;
  await require('../../database/db').updateGuildConfig(interaction.guild.id, upd);
  await interaction.reply({embeds:[require('../utils/embeds').success('Bienvenue configurée', `Salon: ${ch}${msg?'\nMessage: '+msg:''}\nVariables: {user} {server} {count}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};