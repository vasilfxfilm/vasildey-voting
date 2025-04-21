const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')

module.exports = async (interaction, client) => {

  if (!interaction.isModalSubmit()) return
  
  if (interaction.customId === 'applicationModal') {
    const appCount = fs.existsSync(`./data/${interaction.guild.id}`) ? fs.existsSync(`./data/${interaction.guild.id}/applications.json`) ? JSON.parse(fs.readFileSync(`./data/${interaction.guild.id}/applications.json`)).length : 0 : 0
    if (appCount >= 25) {
      interaction.reply({
        content: "❌ **The server has reached the maximum number of applications.**",
        ephemeral: true
      })
      return
    }

    const input = interaction.fields.getTextInputValue('applicationInput')
    if (input) {
      global.setApp(interaction.user, input, interaction.guild.id)

      if (!interaction.member.roles.cache.has('1216778577979244544')) {
        interaction.reply({
          content: "✅ **Successfully enrolled as a candidate and set your application.**",
          ephemeral: true,
        })
      } else {
        interaction.reply({
          content: "✅ **Successfully modified your application.**",
          ephemeral: true,
        })
      }
    } else {
      global.setApp(interaction.user, "[NO APPLICATION SUBMITTED]", interaction.guild.id)
      interaction.reply({
        content: "✅ **Cleared your application successfully.** But don't worry, you're still in the election!",
        ephemeral: true,
      })
    }
  }
}