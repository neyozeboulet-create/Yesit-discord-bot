const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Système de tickets')
    .addSubcommand(s=>s.setName('setup').setDescription('Poster le panel tickets').addChannelOption(o=>o.setName('channel').setDescription('salon').setRequired(true)))
    .addSubcommand(s=>s.setName('close').setDescription('Fermer le ticket actuel'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction){
    const sub = interaction.options.getSubcommand();
    if(sub==='setup'){
      const ch = interaction.options.getChannel('channel');
      const embed = new EmbedBuilder().setColor(0x5865F2).setTitle('🎫 Support').setDescription('Clique sur le bouton pour ouvrir un ticket privé avec le staff.');
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('create_ticket').setLabel('Ouvrir un ticket').setStyle(ButtonStyle.Primary).setEmoji('🎫')
      );
      await ch.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: `✅ Panel envoyé dans ${ch}`, ephemeral: true });
    }
    if(sub==='close'){
      if(!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content:'❌ Pas un salon ticket', ephemeral:true });
      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('close_ticket').setLabel('Confirmer fermeture').setStyle(ButtonStyle.Danger));
      await interaction.reply({ content:'Tu veux fermer ce ticket ?', components:[row] });
    }
  }
};
