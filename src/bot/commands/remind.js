const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('remind').setDescription('Rappel').addIntegerOption(o=>o.setName('minutes').setDescription('minutes').setRequired(true)).addStringOption(o=>o.setName('message').setDescription('message').setRequired(true)),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const min=interaction.options.getInteger('minutes');
  const msg=interaction.options.getString('message');
  if(min<1||min>10080) return interaction.reply({embeds:[require('../utils/embeds').error('Durée invalide','1 à 10080 minutes')],ephemeral:true});
  const {db}=require('../../database/db');
  db.run('INSERT INTO reminders (user_id,guild_id,content,remind_at,created_at) VALUES (?,?,?,?,?)',[interaction.user.id, interaction.guild.id, msg, Date.now()+min*60000, Date.now()]);
  setTimeout(()=> { interaction.followUp(`<@${interaction.user.id}> Rappel : ${msg}`).catch(()=>{}); }, min*60000);
  await interaction.reply({embeds:[require('../utils/embeds').success('Rappel programmé', `Je te rappellerai dans ${min} min : ${msg}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};