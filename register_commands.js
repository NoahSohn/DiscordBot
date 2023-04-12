//Require the dotenv library to use the token from .env
const dotenv = require('dotenv');

// Require the necessary discord.js classes
const { REST, Routes } = require('discord.js');

//Require filesystem browsing libraries
const fs = require('node:fs');
const path = require('node:path');

//Get configuration settings from config.js
const { clientId, guildId, commandsFolder } = require('./config.json');

//Configure dotenv
dotenv.config();

console.log('commandsFolder:', commandsFolder);

// Read commands from the "commands" folder and its subdirectories
const commands = [];
const commandsPath = path.join(__dirname, commandsFolder);
const commandFiles = getCommandFiles(commandsPath);

// Helper function to get all .js files in a directory and its subdirectories
function getCommandFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents
    .filter(dirent => !dirent.isDirectory() && dirent.name.endsWith('.js'))
    .map(dirent => path.join(dir, dirent.name));
  const folders = dirents.filter(dirent => dirent.isDirectory());
  for (const folder of folders) {
    files.push(...getCommandFiles(path.join(dir, folder.name)));
  }
  return files;
}

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(file);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

// Deploy commands
(async () => {
  try {
    console.log(`Started updating ${commands.length} application commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully updated ${data.length} application commands.`);
  } catch (error) {
    // Catch and log any errors!
    console.error(error);
  }
})();