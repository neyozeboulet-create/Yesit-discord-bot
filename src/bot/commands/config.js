const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, updateGuildConfig } = require('../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configurer le bot')
    .addSubcommand(s=>s.setName('view').setDescription('Voir la config'))
    .addSubcommand(s=>s.setName('welcome').setDescription('Salon de bienvenue').addChannelOption(o=>o.setName('channel').setDescription('salon')))
    .addSubcommand(s=>s.setName('logs').setDescription('Salon de logs').addChannelOption(o=>o.setName('channel').setDescription('salon')))
    .addSubcommand(s=>s.setName('toggle').setDescription('Toggle XP/AutoMod').addStringOption(o=>o.setName('feature').setDescription('xp ou automod').setRequired(true).addChoices({name:'xp', value:'xp'},{name:'automod', value:'automod'})).addBooleanOption(o=>o.setName('enabled').setDescription('on/off').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction){
    const sub = interaction.options.getSubcommand();
    const gid = interaction.guild.id;
    if(sub==='view'){
      const cfg = await getGuildConfig(gid);
      await interaction.reply(`**Config**\nWelcome: ${cfg.welcome_channel ? `<#${cfg.welcome_channel}>`:'non défini'}\nLogs: ${cfg.log_channel? `<#${cfg.log_channel}>`:'non défini'}\nAutoMod: ${cfg.auto_mod?'ON':'OFF'}\nXP: ${cfg.xp_enabled?'ON':'OFF'}`);
    }
    if(sub==='welcome'){
      const ch = interaction.options.getChannel('channel');
      await updateGuildConfig(gid, { welcome_channel: ch ? ch.id : null });
      await interaction.reply(`✅ Welcome défini sur ${ch||'aucun'}`);
    }
    if(sub==='logs'){
      const ch = interaction.options.getChannel('channel');
      await updateGuildConfig(gid, { log_channel: ch ? ch.id : null });
      await interaction.reply(`✅ Logs défini sur ${ch||'aucun'}`);
    }
    if(sub==='toggle'){
      const feat = interaction.options.getString('feature');
      const en = interaction.options.getBoolean('enabled');
      if(feat==='xp') await updateGuildConfig(gid, { xp_enabled: en?1:0 });
      if(feat==='automod') await updateGuildConfig(gid, { auto_mod: en?1:0 });
      await interaction.reply(`✅ ${feat} -> ${en?'ON':'OFF'}`);
    }
  }
};
