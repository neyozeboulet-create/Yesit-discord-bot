const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('rep').setDescription('Donner un point de réputation').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)),
  category: 'Niveaux',
  async execute(interaction){
    try{ 
  const t=interaction.options.getUser('membre');
  if(t.id===interaction.user.id) return interaction.reply({embeds:[require('../utils/embeds').error('Refusé','Tu ne peux pas te rep toi-même')],ephemeral:true});
  if(t.bot) return interaction.reply({embeds:[require('../utils/embeds').error('Refusé','Pas un bot')],ephemeral:true});
  const me=await require('../../database/db').getUser(interaction.user.id, interaction.guild.id);
  if(Date.now()-me.rep_last < 86400000) return interaction.reply({embeds:[require('../utils/embeds').warning('Cooldown', 'Un rep par 24h')],ephemeral:true});
  const target=await require('../../database/db').getUser(t.id, interaction.guild.id);
  await require('../../database/db').updateUser(t.id, interaction.guild.id, {rep: target.rep+1});
  await require('../../database/db').updateUser(interaction.user.id, interaction.guild.id, {rep_last: Date.now()});
  await interaction.reply({embeds:[require('../utils/embeds').success('Réputation', `+1 rep pour ${t} (total ${target.rep+1})`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};