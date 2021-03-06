// heart ^
require('dotenv').config();
const discord = require('discord.js');
const client = new discord.Client();
const PREFIX = process.env.BOT_PREFIX;
client.login(process.env.BOT_TOKEN);

client.on('ready', () => { console.log(`Logged as ${client.user.tag}!`)});

// command handler
const fs = require('fs').promises;
const path = require('path');
client.commands = new Map();

client.on('message', async function(message) {
    if(message.author.bot) return;
    
    if(!message.content.startsWith(PREFIX)) return;
    let cmdArgs = message.content.substring(message.content.indexOf(PREFIX)+1).split(new RegExp(/\s+/))
    let cmdName = cmdArgs.shift();
    
    if(client.commands.get(cmdName)) {
        client.commands.get(cmdName).run(client, message, cmdArgs);
    } else {
        console.log("Command does not exist")
    }
});

(async function registerCommands(dir = 'commands') {
    // Read the directory file
    let files = await fs.readdir(path.join(__dirname, dir));
    // Loop through each file
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir,  file));
        if(stat.isDirectory()) // If file is a directory, recursive call recurDir
            registerCommands(path.join(dir, file));
        else {
            // Check if file is a js.file
            if(file.endsWith(".js")) {
                let cmdName = file.substring(0, file.indexOf(".js"));
                let cmdModule = require(path.join(__dirname, dir, file));
                client.commands.set(cmdName, cmdModule);
                
            }
        }
    }
})()

