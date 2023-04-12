const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('statistics')
		.setDescription("Checks the bot's uptime and latency"),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Checking...', fetchReply: true });
		const statisticsEmbed = new EmbedBuilder()
			.setTitle('Bot Statistics')
			.addFields(
				{ name: 'Uptime', value: `${Math.round(interaction.client.uptime / 60000)} minutes` },
				{ name: 'Websocket Heartbeat', value: `${interaction.client.ws.ping}ms`, inline: true },
				{ name: 'Rountrip Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
			)
		await interaction.editReply( embeds: [statisticsEmbed] );
	},
};