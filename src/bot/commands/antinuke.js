const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('antinuke').setDescription('Configurer antinuke').addBooleanOption(o=>o.setName('activer').setDescription('activer').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Sécurité',
  async execute(interaction){
    try{ 
  const en=interaction.options.getBoolean('activer');
  await require('../../database/db').updateGuildConfig(interaction.guild.id, {antinuke: en?1:0});
  await interaction.reply({embeds:[require('../utils/embeds').success('Antinuke', en?'Activé':'Désactivé')]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};