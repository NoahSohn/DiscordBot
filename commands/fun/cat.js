const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Gives a random cat picture"),
  async execute(interaction) {
    await interaction.reply({
      files: [{ attachment: "https://cataas.com/cat", name: "cat.png" }],
    });
  },
};
