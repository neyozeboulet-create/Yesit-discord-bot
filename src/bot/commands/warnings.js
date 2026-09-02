const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('warnings').setDescription('Voir les warns').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ModerateMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const {db}=require('../../database/db');
  const rows=await new Promise(r=> db.all('SELECT * FROM warns WHERE guild_id=? AND user_id=? ORDER BY timestamp DESC LIMIT 10',[interaction.guild.id,user.id],(e,rs)=>r(rs||[])));
  if(!rows.length) return interaction.reply({embeds:[require('../utils/embeds').info('Avertissements', `Aucun warn pour ${user.tag}`)]}); 
  const desc=rows.map(x=> `#${x.id} <@${x.moderator_id}> - ${x.reason} (<t:${Math.floor(x.timestamp/1000)}:R>)`).join('\n');
  await interaction.reply({embeds:[require('../utils/embeds').info(`Warns - ${user.tag}`, desc)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};