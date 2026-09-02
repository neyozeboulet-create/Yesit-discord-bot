const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('poll').setDescription('Créer un sondage').addStringOption(o=>o.setName('question').setDescription('question').setRequired(true)).addStringOption(o=>o.setName('choix').setDescription('choix').setRequired(true)).setDefaultMemberPermissions(require('../utils/permissions').PermissionFlagsBits.ManageMessages),
  category: 'Utilitaire',
  async execute(interaction){
    try{ 
  const q=interaction.options.getString('question');
  const choix=interaction.options.getString('choix').split(',').map(s=>s.trim()).slice(0,10);
  if(choix.length<2) return interaction.reply({embeds:[require('../utils/embeds').error('Choix insuffisants','2 à 10 choix séparés par des virgules')],ephemeral:true});
  const emojis=['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
  const desc=choix.map((c,i)=> `${emojis[i]} ${c}`).join('\n');
  const e=require('../utils/embeds').info(`Sondage - ${q}`, desc).setFooter({text:'Réagis pour voter'});
  const msg=await interaction.reply({embeds:[e], fetchReply:true});
  for(let i=0;i<choix.length;i++) await msg.react(emojis[i]).catch(()=>{}); }catch(e){ console.error(e); if(!interaction.replied) await interaction.reply({embeds:[require('../utils/embeds').error('Erreur', e.message)], ephemeral:true}); }
  }
};