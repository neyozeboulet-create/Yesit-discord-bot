const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('avatar').setDescription('Afficher avatar').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(false)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const u=interaction.options.getUser('membre')||interaction.user;
  const url=u.displayAvatarURL({size:1024, extension:'png'});
  const e=require('../utils/embeds').info(`Avatar - ${u.tag}`, `[Lien direct](${url})`).setImage(url);
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};