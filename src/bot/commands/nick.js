const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('nick').setDescription('Changer le pseudo').addUserOption(o=>o.setName('membre').setDescription('membre').setRequired(true)).addStringOption(o=>o.setName('pseudo').setDescription('pseudo').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageNicknames),
  category: 'Modération',
  async execute(interaction){
    try{ 
  const user=interaction.options.getUser('membre');
  const pseudo=interaction.options.getString('pseudo');
  const m=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(!m) return interaction.reply({embeds:[require('../utils/embeds').error('Introuvable','Membre non trouvé')],ephemeral:true});
  await m.setNickname(pseudo).catch(e=> interaction.reply({embeds:[require('../utils/embeds').error('Échec', e.message)],ephemeral:true}));
  await interaction.reply({embeds:[require('../utils/embeds').success('Pseudo modifié', `${user.tag} → ${pseudo}`)]}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};