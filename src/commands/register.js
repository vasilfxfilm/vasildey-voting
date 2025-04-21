const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Create a button to allow users to be a candidate")
    .addStringOption(option =>
      option.setName("display-text")
      .setDescription("What should the message say?")
      .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("button-text")
      .setDescription("Modify the Enroll button text")
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

    const displayText = interaction.options.getString("display-text")
    const buttonText = interaction.options.getString("button-text")

    const embed = new EmbedBuilder()
      .setTitle("Candidate Enrollment")
      .setDescription(displayText)
      .setColor(0xebcc34)
      .setThumbnail("https://cdn.discordapp.com/attachments/1181015540274315365/1362597305009700894/ballot-box.png?ex=6802f921&is=6801a7a1&hm=0a446fc9b6a00dca7311f11fe77074553576c08d41d582037ddf78d8f5600ddd&")

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId("enrollBtn")
      .setLabel(buttonText || "Write Application")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Success)
    )

    interaction.reply({
      embeds: [embed],
      components: [row]
    })

    
  }
}