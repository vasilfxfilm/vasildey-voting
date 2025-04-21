require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const {CommandKit} = require('commandkit')
const fs = require('fs')

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

new CommandKit({
  client,
  devUserIds: ['526214948674600990'],
  commandsPath: `${__dirname}/commands`,
  eventsPath: `${__dirname}/events`,
  bulkRegister: true,
  devGuildIds: ['933095615792025620'],
})

global.setApp = function(user, text, serverId) {
  let data
  if (!fs.existsSync(`./data/${serverId}`)) {
    fs.mkdirSync(`./data/${serverId}`)
  }

  if (fs.existsSync(`./data/${serverId}/applications.json`)) {
    data = JSON.parse(fs.readFileSync(`./data/${serverId}/applications.json`))
  } else {
    data = {}
  }
  data[user.username] = text
  fs.writeFileSync(`./data/${serverId}/applications.json`, JSON.stringify(data, null, 2))
}
global.getApp = function(user, serverId) {
  let data
  if (fs.existsSync(`./data/${serverId}/applications.json`)) {
    data = JSON.parse(fs.readFileSync(`./data/${serverId}/applications.json`))
  } else {
    data = {}
  }

  if (data[user.username]) {
    return data[user.username]
  } else {
    return ""
  }
}

client.on('messageCreate', (message) => {
  if (message.author.bot) return

  if (message.content.startsWith('v!')) {
    if (!message.member.roles.cache.has('1215474689980502096')) {
      message.reply('You do not have the VASILDEY BUDDY role! Womp womp')
      return
    }

    const command = message.content.split(' ')[0].slice(2)

    if (command === 'help') {
      message.reply('**SUP Voting Commands:**\nv!fetchApps - *Grabs the application JSON file and sends it*\n> v!fetchVotes - *Grabs the votes JSON file and sends it*\n> v!help - *get help lol*')
    } 
    if (command === 'fetchApps') {
      if (!fs.existsSync('./applications.json')) {
        message.channel.send('❌ **The `applications.json` file does not exist in the bot directory.** To solve this, please write a Moderator application.')
        return
      }
      message.channel.send({
        content: "Sure, here's the Mod Applications.",
        files: ['./applications.json']
      })
    } if (command === 'fetchVotes') {
      if (!fs.existsSync('./votes.json')) {
        message.channel.send('❌ **The `votes.json` file does not exist in the bot directory.** To solve this, please write a Moderator application.')
        return
      }
      message.channel.send({
        content: "Sure, here are the Votes.",
        files: ['./votes.json']
      })
    }  
  }
})

client.on('interactionCreate', (interaction) => {

})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.TOKEN)