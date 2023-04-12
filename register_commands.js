//Require the dotenv library to use the token from .env
const dotenv = require('dotenv');

// Require the necessary discord.js classes
const { REST, Routes } = require('discord.js');

//Require filesystem browsing libraries
const fs = require('node:fs');
const path = require('node:path');

//Get configuration settings from config.js
const { clientId, guildId } = require('./config.json');

//Configure dotenv
dotenv.config();

//Read commands from the "commands" folder
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

//Deploy  commands
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
