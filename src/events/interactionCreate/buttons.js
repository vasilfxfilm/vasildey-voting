const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')

module.exports = async (interaction, client) => {

  if (!interaction.isButton()) return
  
  if (interaction.customId === "enrollBtn") {
    const appCount = fs.existsSync(`./data/${interaction.guild.id}`) ? fs.existsSync(`./data/${interaction.guild.id}/applications.json`) ? JSON.parse(fs.readFileSync(`./data/${interaction.guild.id}/applications.json`)).length : 0 : 0
    if (appCount >= 25) {
      interaction.reply({
        content: "❌ **The server has reached the maximum number of applications.**",
        ephemeral: true
      })
      return
    }

    const modal = new ModalBuilder()
    .setCustomId('applicationModal')
    .setTitle('📝 Write an Application')

    const appInput = new TextInputBuilder()
    .setCustomId('applicationInput')
    .setLabel('Enter your application below:')
    .setMaxLength(4000)
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Start your application here...")
    .setRequired(false)
    .setValue(global.getApp(interaction.user, interaction.guild.id))

    const actionRow1 = new ActionRowBuilder().addComponents(appInput)

    // Add the ActionRow to the modal
    modal.addComponents(actionRow1)

    // Show the modal
    interaction.showModal(modal)
  }
}