require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

function collect(dir, arr=[]){
  for(const e of fs.readdirSync(dir, {withFileTypes:true})){
    const full=path.join(dir,e.name);
    if(e.isDirectory()) collect(full,arr);
    else if(e.isFile() && e.name.endsWith('.js')){
      const cmd=require(full);
      if(cmd.data) arr.push(cmd.data.toJSON());
    }
  }
  return arr;
}
const commands = collect(path.join(__dirname, 'commands'));
console.log(`Found ${commands.length} commands`);
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (process.env.GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
      console.log(`Deployed ${commands.length} guild commands`);
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      console.log(`Deployed ${commands.length} global commands`);
    }
  } catch (e) { console.error(e.rawError || e.message); }
})();
