const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('verify').setDescription('Vérifier un membre').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageRoles),
  category: 'Sécurité',
  async execute(interaction){
    try{ 
  const u=interaction.options.getUser('membre');
  const cfg=await require('../../database/db').getGuildConfig(interaction.guild.id);
  if(!cfg.verification_role) return interaction.reply({embeds:[require('../utils/embeds').error('Non configuré','Définis un rôle de vérification via /setwelcome ou dashboard')],ephemeral:true});
  const m=await interaction.guild.members.fetch(u.id).catch(()=>null);
  await m.roles.add(cfg.verification_role).catch(()=>{});
  await interaction.reply({embeds:[require('../utils/embeds').success('Vérifié', `${u} vérifié`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};