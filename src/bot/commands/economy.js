const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser, updateUser, db } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription('Commandes économie')
    .addSubcommand(s => s.setName('balance').setDescription('Voir ton solde'))
    .addSubcommand(s => s.setName('daily').setDescription('Récompense quotidienne'))
    .addSubcommand(s => s.setName('pay').setDescription('Payer un membre').addUserOption(o=>o.setName('user').setDescription('destinataire').setRequired(true)).addIntegerOption(o=>o.setName('amount').setDescription('montant').setRequired(true)))
    .addSubcommand(s => s.setName('leaderboard').setDescription('Top riches'))
    .addSubcommand(s => s.setName('shop').setDescription('Voir le shop'))
    .addSubcommand(s => s.setName('buy').setDescription('Acheter un item').addIntegerOption(o=>o.setName('id').setDescription('ID item').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'balance') {
      const u = await getUser(interaction.user.id, guildId);
      await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFFD700).setTitle('💰 Portefeuille').setDescription(`**${u.coins}** coins | Niveau ${u.level} (${u.xp} XP)`)] });
    }
    if (sub === 'daily') {
      const u = await getUser(interaction.user.id, guildId);
      const now = Date.now();
      if (now - u.daily_last < 86400000) {
        const rest = Math.ceil((86400000 - (now - u.daily_last))/3600000);
        return interaction.reply({ content: `⏳ Reviens dans ${rest}h`, ephemeral: true });
      }
      const gain = 250 + Math.floor(Math.random()*100);
      await updateUser(interaction.user.id, guildId, { coins: u.coins + gain, daily_last: now });
      await interaction.reply(`✅ +${gain} coins ! (daily)`);
    }
    if (sub === 'pay') {
      const target = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');
      if (target.bot || target.id === interaction.user.id) return interaction.reply({ content: '❌ Cible invalide', ephemeral: true });
      if (amount <=0) return interaction.reply({ content: '❌ Montant invalide', ephemeral: true });
      const from = await getUser(interaction.user.id, guildId);
      if (from.coins < amount) return interaction.reply({ content: '❌ Pas assez de coins', ephemeral: true });
      const to = await getUser(target.id, guildId);
      await updateUser(interaction.user.id, guildId, { coins: from.coins - amount });
      await updateUser(target.id, guildId, { coins: to.coins + amount });
      await interaction.reply(`💸 ${interaction.user} a payé **${amount}** à ${target}`);
    }
    if (sub === 'leaderboard') {
      db.all(`SELECT id, coins, level FROM users WHERE guild_id=? ORDER BY coins DESC LIMIT 10`, [guildId], async (err, rows) => {
        if (err) return interaction.reply('Erreur');
        let desc = rows.map((r,i)=> `**${i+1}.** <@${r.id}> - ${r.coins} coins (lvl ${r.level})`).join('\n') || 'Aucune donnée';
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Top Riches').setDescription(desc).setColor(0xFFD700)] });
      });
    }
    if (sub === 'shop') {
      db.all(`SELECT * FROM shop WHERE guild_id=?`, [guildId], async (err, rows) => {
        if (!rows || rows.length===0) return interaction.reply('🛒 Shop vide - ajoute des items via le dashboard');
        const desc = rows.map(r=> `\`ID ${r.id}\` **${r.name}** - ${r.price} coins ${r.role_id ? `(<@&${r.role_id}>)`:''}`).join('\n');
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle('🛒 Shop').setDescription(desc).setColor(0x5865F2)] });
      });
    }
    if (sub === 'buy') {
      const id = interaction.options.getInteger('id');
      db.get(`SELECT * FROM shop WHERE id=? AND guild_id=?`, [id, guildId], async (err, item) => {
        if (!item) return interaction.reply({ content: '❌ Item introuvable', ephemeral: true });
        const u = await getUser(interaction.user.id, guildId);
        if (u.coins < item.price) return interaction.reply({ content: '❌ Pas assez de coins', ephemeral: true });
        await updateUser(interaction.user.id, guildId, { coins: u.coins - item.price });
        if (item.role_id) {
          const member = await interaction.guild.members.fetch(interaction.user.id);
          await member.roles.add(item.role_id).catch(()=>{});
        }
        await interaction.reply(`✅ Tu as acheté **${item.name}** pour ${item.price} coins !`);
      });
    }
  }
};
