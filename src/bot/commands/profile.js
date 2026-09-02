const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('profile').setDescription('Profil complet').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(false)),
  category: 'Niveaux',
  async execute(interaction){
    try{ 
  const u=interaction.options.getUser('membre')||interaction.user;
  const data=await require('../../database/db').getUser(u.id, interaction.guild.id);
  const {db}=require('../../database/db');
  const rank=await new Promise(r=> db.all('SELECT id FROM users WHERE guild_id=? ORDER BY level DESC, xp DESC',[interaction.guild.id],(e,rs)=>{ const idx=(rs||[]).findIndex(x=>x.id===u.id); r(idx+1); }));
  const e=require('../utils/embeds').info(`Profil - ${u.tag}`, `**Niveau:** ${data.level} (${data.xp} XP)\n**Coins:** ${data.coins}\n**Rep:** ${data.rep}\n**Rang:** #${rank}\n**Warns:** ${data.warnings}`);
  e.setThumbnail(u.displayAvatarURL());
  await interaction.reply({embeds:[e]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};