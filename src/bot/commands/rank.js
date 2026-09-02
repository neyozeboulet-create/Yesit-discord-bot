const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { getUser, db } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Voir niveau/XP')
    .addUserOption(o=>o.setName('user').setDescription('membre')),
  async execute(interaction){
    const user = interaction.options.getUser('user') || interaction.user;
    const u = await getUser(user.id, interaction.guild.id);
    const needed = u.level * 300;
    const percent = Math.floor((u.xp / needed)*100);
    const bar = '█'.repeat(Math.floor(percent/10)) + '░'.repeat(10 - Math.floor(percent/10));
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setTitle(`Niveau ${u.level}`)
      .setDescription(`**${u.xp}/${needed} XP** (${percent}%)\n\`${bar}\`\n💰 ${u.coins} coins`)
      .setThumbnail(user.displayAvatarURL());
    // rank position
    db.all(`SELECT id, xp, level FROM users WHERE guild_id=? ORDER BY level DESC, xp DESC`, [interaction.guild.id], async (err, rows)=>{
      const idx = rows.findIndex(r=>r.id===user.id);
      embed.setFooter({ text: `Rang #${idx+1} / ${rows.length}` });
      await interaction.reply({ embeds: [embed] });
    });
  }
};
