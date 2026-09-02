const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setautorole').setDescription('Configurer autorôle').addRoleOption(o=>o.setName('role').setDescription('role').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.Administrator),
  category: 'Admin',
  async execute(interaction){
    try{ 
  const r=interaction.options.getRole('role');
  await require('../../database/db').updateGuildConfig(interaction.guild.id, {autorole:r.id});
  await interaction.reply({embeds:[require('../utils/embeds').success('Autorôle', `Nouveaux membres → ${r}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};