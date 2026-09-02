const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('invite').setDescription('Lien d inviation du bot'),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const id=interaction.client.user.id;
  const link=`https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands`;
  await interaction.reply({embeds:[require('../utils/embeds').info('Inviter le bot', `[Clique ici pour inviter] (${link})`)],ephemeral:true}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};