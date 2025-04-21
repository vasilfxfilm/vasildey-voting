const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch')
    .setDescription('Gets data from the election database')
    .addStringOption(option =>
      option.setName('data')
      .setDescription('The data to fetch')
      .setRequired(true)
      .addChoices(
        { name: 'applications', value: 'applications' },
        { name: 'votes', value: 'votes' },
      )
    ),

  run: async ({ interaction }) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      interaction.reply({
        content: "❌ **You must have the *Administrator* permission to use this command.**",
        ephemeral: true
      })
      return
    }

    let data = null
    const dataOption = interaction.options.getString('data')
    if (fs.existsSync(`./data/${interaction.guild.id}`)) {
      if (fs.existsSync(`./data/${interaction.guild.id}/${interaction.options.getString('data')}.json`)) {
        data = JSON.parse(fs.readFileSync(`./data/${interaction.guild.id}/${interaction.options.getString('data')}.json`))
      }
    }

    if (data) {
      interaction.reply({
        content: `✅ **Here are the ${dataOption} in JSON format:**`,
        files: [`./data/${interaction.guild.id}/${interaction.options.getString('data')}.json`],
        ephemeral: true
      })
    } else {
      interaction.reply({
        content: `❌ **The ${dataOption} file does not exist!**`,
        ephemeral: true
      })
    }
  }
}