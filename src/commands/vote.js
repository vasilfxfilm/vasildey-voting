const { SlashCommandBuilder, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");
const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Sends the message to vote for a Candidate")
    .addIntegerOption(option =>
      option.setName("quantity")
      .setDescription("How many candidates must be selected by each voter?")
      .setMinValue(1)
      .setMaxValue(25)
      .setRequired(false)
    ),

  run: async ({ interaction }) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      interaction.reply({
        content: "❌ **You must have the *Administrator* permission to use this command.**",
        ephemeral: true
      })
      return
    }

    const quantity = interaction.options.getInteger("quantity") || 1;

    try {
      const data = JSON.parse(fs.readFileSync(`./data/${interaction.guild.id}/applications.json`))
      const users = Object.keys(data);

      const voteOptions = users.map(username => {
        const member = interaction.guild.members.cache.find(m => m.user.username === username);
          
        const displayName = member ? member.displayName : username;

        // Build the menu option with no description if the member is found
        const option = new StringSelectMenuOptionBuilder()
          .setValue(username)
          .setLabel(displayName)

        // Only add description if the member is found in the guild
        if (member) {
          option.setDescription(`@${username}`);
        }

        return option;
      })

      if (voteOptions.length === 0) {
        interaction.reply.send({
          content: "❌ **There are no candidates to vote for.**",
          ephemeral: true
        })
        return
      }

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('voteSelect')
          .setPlaceholder(`Select ${quantity} members...`)
          .setMinValues(quantity)
          .setMaxValues(quantity)
          .addOptions(voteOptions)
      );

      interaction.reply({
        components: [row],
      })
  } catch (error) {
      console.error("Error in vote command:", error);
      interaction.reply({
        content: "❌ **An error occurred while processing your request.**",
        ephemeral: true
      })
  }
  }
}