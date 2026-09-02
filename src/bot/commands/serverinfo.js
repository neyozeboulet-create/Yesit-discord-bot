const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Infos serveur'),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const g=interaction.guild;
  await g.fetch();
  const e=require('../utils/embeds').info(g.name, `**ID:** ${g.id}\n**Owner:** <@${g.ownerId}>\n**Membres:** ${g.memberCount}\n**Salons:** ${g.channels.cache.size}\n**Rôles:** ${g.roles.cache.size}\n**Créé:** <t:${Math.floor(g.createdTimestamp/1000)}:F>\n**Boosts:** ${g.premiumSubscriptionCount||0} (niveau ${g.premiumTier})`);
  if(g.iconURL()) e.setThumbnail(g.iconURL());
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};