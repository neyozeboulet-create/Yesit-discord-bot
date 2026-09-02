const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('gstart').setDescription('Lancer un giveaway').addChannelOption(o=>o.setName('salon').setDescription('salon').setRequired(true)).addStringOption(o=>o.setName('duree').setDescription('duree').setRequired(true)).addIntegerOption(o=>o.setName('gagnants').setDescription('gagnants').setRequired(true)).addStringOption(o=>o.setName('lot').setDescription('lot').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageEvents),
  category: 'Giveaway',
  async execute(interaction){
    try{ 
  const ch=interaction.options.getChannel('salon');
  const duree=interaction.options.getString('duree');
  const winners=interaction.options.getInteger('gagnants');
  const prize=interaction.options.getString('lot');
  const ms=require('../../bot/utils/time.js')?.parseDuration(duree) || 60000;
  if(!ms) return interaction.reply({embeds:[require('../utils/embeds').error('Durée invalide','Ex: 1h, 30m, 2d')],ephemeral:true});
  const end=Date.now()+ms;
  const embed=require('../utils/embeds').info('Giveaway', `**Lot:** ${prize}\n**Gagnants:** ${winners}\n**Fin:** <t:${Math.floor(end/1000)}:R>\nRéagis avec la réaction pour participer !`).setFooter({text:'Giveaway en cours'});
  const msg=await ch.send({embeds:[embed]});
  await msg.react('🎉').catch(()=>{});
  const {db}=require('../../database/db');
  db.run('INSERT INTO giveaways (guild_id,channel_id,message_id,prize,winners,ends_at,created_by) VALUES (?,?,?,?,?,?,?)',[interaction.guild.id,ch.id,msg.id,prize,winners,end,interaction.user.id]);
  await interaction.reply({embeds:[require('../utils/embeds').success('Giveaway lancé', `Dans ${ch} - lot: ${prize}`)],ephemeral:true}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};