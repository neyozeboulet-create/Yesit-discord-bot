const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fun')
    .setDescription('Commandes fun')
    .addSubcommand(s=>s.setName('8ball').setDescription('Pose une question').addStringOption(o=>o.setName('question').setDescription('question').setRequired(true)))
    .addSubcommand(s=>s.setName('coinflip').setDescription('Pile ou face'))
    .addSubcommand(s=>s.setName('dice').setDescription('Lancer un dé').addIntegerOption(o=>o.setName('faces').setDescription('nb faces').setRequired(false)))
    .addSubcommand(s=>s.setName('ask').setDescription('Parler à l\'IA').addStringOption(o=>o.setName('prompt').setDescription('ton message').setRequired(true))),
  async execute(interaction){
    const sub = interaction.options.getSubcommand();
    if(sub==='8ball'){
      const q = interaction.options.getString('question');
      const answers = ['Oui absolument','Non','Peut-être','C\'est certain','N\'y compte pas','Demande plus tard','Oui','Non clairement','Très probable'];
      await interaction.reply(`🎱 **${q}**\n> ${answers[Math.floor(Math.random()*answers.length)]}`);
    }
    if(sub==='coinflip'){
      await interaction.reply(Math.random()>0.5 ? '🪙 **Pile**' : '🪙 **Face**');
    }
    if(sub==='dice'){
      const faces = interaction.options.getInteger('faces')||6;
      await interaction.reply(`🎲 Tu as tiré **${Math.floor(Math.random()*faces)+1}** / ${faces}`);
    }
    if(sub==='ask'){
      const prompt = interaction.options.getString('prompt');
      // Mode sans clé = réponse mock sympa
      if(!process.env.OPENAI_API_KEY){
        return interaction.reply(`🤖 (mode demo sans clé) Tu as dit: "${prompt}" -> Je suis ton bot IA du serveur ! Configure OPENAI_API_KEY pour avoir de vraies réponses.`);
      }
      await interaction.deferReply();
      try{
        const res = await fetch('https://api.openai.com/v1/chat/completions',{
          method:'POST',
          headers:{ 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type':'application/json'},
          body: JSON.stringify({ model:'gpt-4o-mini', messages:[{role:'user', content: prompt}], max_tokens:300 })
        });
        const data = await res.json();
        const answer = data.choices?.[0]?.message?.content || 'Pas de réponse';
        await interaction.editReply(answer.slice(0,1900));
      }catch(e){ await interaction.editReply('❌ Erreur IA: '+e.message); }
    }
  }
};
