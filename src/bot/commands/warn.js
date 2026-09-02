const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('warn').setDescription('Avertir un membre').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('raison').setDescription('raison').setRequired(false)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ModerateMembers),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const raison=interaction.options.getString('raison')||'Aucune raison';
  const {db}=require('../../database/db');
  db.run('INSERT INTO warns (guild_id,user_id,moderator_id,reason,timestamp) VALUES (?,?,?,?,?)',[interaction.guild.id,user.id,interaction.user.id,raison,Date.now()]);
  const count=await new Promise(r=> db.get('SELECT COUNT(*) as c FROM warns WHERE guild_id=? AND user_id=?',[interaction.guild.id,user.id],(e,row)=> r(row?.c||0)));
  await require('../../database/db').addLog({guild_id:interaction.guild.id,type:'warn',target_id:user.id,moderator_id:interaction.user.id,reason:raison});
  const embed=require('../utils/embeds').warning('Avertissement', `**${user.tag}** averti (${count} warns)\nRaison: ${raison}`);
  await interaction.reply({embeds:[embed]});
  if(count>=3){ const m=await interaction.guild.members.fetch(user.id).catch(()=>null); if(m) await m.timeout(3600000,'3 warns').catch(()=>{}); } }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};