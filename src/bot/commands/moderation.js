const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getUser, updateUser } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Modération')
    .addSubcommand(s=>s.setName('warn').setDescription('Avertir').addUserOption(o=>o.setName('user').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('raison')))
    .addSubcommand(s=>s.setName('clear').setDescription('Supprimer messages').addIntegerOption(o=>o.setName('amount').setDescription('1-100').setRequired(true)))
    .addSubcommand(s=>s.setName('kick').setDescription('Kick').addUserOption(o=>o.setName('user').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('raison')))
    .addSubcommand(s=>s.setName('ban').setDescription('Ban').addUserOption(o=>o.setName('user').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('raison')))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction){
    const sub = interaction.options.getSubcommand();
    if (sub==='warn'){
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason')||'Aucune raison';
      const u = await getUser(user.id, interaction.guild.id);
      await updateUser(user.id, interaction.guild.id, { warnings: u.warnings+1 });
      await interaction.reply({ embeds: [new EmbedBuilder().setColor(0xFFAA00).setDescription(`⚠️ ${user} averti (${u.warnings+1} warns) - ${reason}`)] });
      if(u.warnings+1 >=3){
        const member = await interaction.guild.members.fetch(user.id).catch(()=>null);
        if(member) await member.timeout(60*60*1000, '3 warns').catch(()=>{});
      }
    }
    if(sub==='clear'){
      const amount = interaction.options.getInteger('amount');
      if(amount<1||amount>100) return interaction.reply({content:'1-100', ephemeral:true});
      await interaction.channel.bulkDelete(amount, true).catch(()=>{});
      await interaction.reply({content:`✅ ${amount} messages supprimés`, ephemeral:true});
    }
    if(sub==='kick'){
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason')||'Aucune raison';
      const member = await interaction.guild.members.fetch(user.id).catch(()=>null);
      if(!member) return interaction.reply({content:'Membre introuvable', ephemeral:true});
      await member.kick(reason).catch(e=> interaction.reply({content:'❌ '+e.message, ephemeral:true}));
      await interaction.reply(`👢 ${user.tag} kick - ${reason}`);
    }
    if(sub==='ban'){
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason')||'Aucune raison';
      await interaction.guild.members.ban(user.id, { reason }).catch(e=> interaction.reply({content:'❌ '+e.message, ephemeral:true}));
      await interaction.reply(`🔨 ${user.tag} banni - ${reason}`);
    }
  }
};
