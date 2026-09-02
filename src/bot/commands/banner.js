const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('banner').setDescription('Afficher bannière').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(false)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const u=interaction.options.getUser('membre')||interaction.user;
  const fetched=await interaction.client.users.fetch(u.id, {force:true});
  const b=fetched.bannerURL({size:1024});
  if(!b) return interaction.reply({embeds:[require('../utils/embeds').info('Bannière', 'Aucune bannière')],ephemeral:true});
  await interaction.reply({embeds:[require('../utils/embeds').info(`Bannière - ${u.tag}`, '').setImage(b)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};