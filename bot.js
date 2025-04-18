require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const setApp = function(user, text) {
  let data
  if (fs.existsSync('./applications.json')) {
    data = JSON.parse(fs.readFileSync('./applications.json'))
  } else {
    data = {}
  }
  data[user.username] = text
  fs.writeFileSync('./applications.json', JSON.stringify(data, null, 2))
}
const getApp = function(user) {
  let data
  if (fs.existsSync('./applications.json')) {
    data = JSON.parse(fs.readFileSync('./applications.json'))
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
      message.reply('**SUP Voting Commands:**\n> v!register - *Sends the message to register for the Mod Election*\n> v!vote - *Sends the message to vote for the Mod Election*\n> v!fetchApps - *Grabs the application JSON file and sends it*\n> v!fetchVotes - *Grabs the votes JSON file and sends it*\n> v!help - *get help lol*')
    } if (command === 'register') {
      const embed = new EmbedBuilder()
      .setColor(0x00baae)
      .setTitle('SUP Moderator Election Nomination')
      .setDescription('Please click one of the buttons below to register for the Mod Election! You are not required to write an application, but it is highly recommended as it allows members to know what you will do as a Moderator.')
      .setThumbnail('https://cdn.discordapp.com/attachments/1187251926862143559/1188647072036040824/Potential_Sup_Logo.png?ex=6762c719&is=67617599&hm=dfbaa1ffb5af721076f5e9f41cb02fb0968c386bb2f3cc254e6881a210822d1d&')
    
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('enrollWithApp')
        .setLabel('Write an Application')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId('enrollNoApp')
        .setLabel('Nope, just enroll me')
        .setStyle(ButtonStyle.Secondary)
      )

      message.channel.send({
        embeds: [embed],
        components: [row]
      })
    } if (command === 'vote') {
      try {
          // Read applications data
          const data = JSON.parse(fs.readFileSync('./applications.json'))
          const users = Object.keys(data);
  
          const voteOptions = users.map(username => {
              // Attempt to find the user in the guild's cache
              const member = message.guild.members.cache.find(m => m.user.username === username);
              
              // Use the member's displayName if found, otherwise fallback to username
              const displayName = member ? member.displayName : username;
  
              // Build the menu option with no description if the member is found
              const option = new StringSelectMenuOptionBuilder()
                  .setValue(username) // Use username as a unique identifier
                  .setLabel(displayName); // Display name or username
  
              // Only add description if the member is found in the guild
              if (member) {
                  option.setDescription(`@${username}`);
              }
  
              return option;
          });
  
          if (voteOptions.length === 0) {
              return message.channel.send("No valid options found to vote on.");
          }
  
          const row = new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                  .setCustomId('voteSelect')
                  .setPlaceholder('Select 3 members...')
                  .setMinValues(3)
                  .setMaxValues(3)
                  .addOptions(voteOptions)
          );
  
          message.channel.send({ components: [row] });
      } catch (error) {
          console.error("Error in vote command:", error);
          message.channel.send("An error occurred while running the vote command.");
      }
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
  if (interaction.isButton()) {
    if (interaction.customId === 'enrollNoApp') {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId('enrollWithApp')
        .setLabel("Okie dokie I'll write an application")
        .setEmoji('📝')
        .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
        .setCustomId('noAppConfirm')
        .setLabel('stfu i know my rights')
        .setStyle(ButtonStyle.Secondary)
      )
      interaction.reply({
        content: "**Are you sure you want to skip your application submission?** It is highly recommended that you attach a short application as it allows members to know what intend on doing as a Moderator, resulting in possibly more votes.",
        components: [row],
        ephemeral: true,
      })
    }

    if (interaction.customId === 'noAppConfirm') {
      if (getApp(interaction.user) === "") {
        setApp(interaction.user, "[NO APPLICATION SUBMITTED]")
        interaction.update({
          content: '✅ **You have enrolled as a <@&1216778577979244544>.** You may add an Application with the green button above if you change your mind.',
          components: [],
          ephemeral: true,
        })

        if (!interaction.member.roles.cache.has('1216778577979244544')) {
          interaction.member.roles.add('1216778577979244544')
        }
      } else {
        interaction.update({
          content: '❌ **You already wrote an application.** You can edit the application by pressing the *Write Application* button once again.',
          components: [],
          ephemeral: true,
        })
      }
    }

    if (interaction.customId === "enrollWithApp") {
      // Create the modal
      const modal = new ModalBuilder()
        .setCustomId('applicationModal')
        .setTitle('📝 Write an Application')

      // Create the text input
      const appInput = new TextInputBuilder()
        .setCustomId('applicationInput')
        .setLabel('How will you improve the server?')
        .setMaxLength(4000)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Start your application here...")
        .setRequired(false)
        .setValue(getApp(interaction.user))

      // Wrap the text input in an ActionRow
      const actionRow1 = new ActionRowBuilder().addComponents(appInput)

      // Add the ActionRow to the modal
      modal.addComponents(actionRow1)

      // Show the modal
      interaction.showModal(modal)
    }
  }



  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'applicationModal') {
      const input = interaction.fields.getTextInputValue('applicationInput')
      if (input) {
        setApp(interaction.user, input)

        if (!interaction.member.roles.cache.has('1216778577979244544')) {
          interaction.reply({
            content: "✅ **Successfully enrolled as a <@&1216778577979244544> and set your application.**",
            ephemeral: true,
          })
          interaction.member.roles.add('1216778577979244544')
        } else {
          interaction.reply({
            content: "✅ **Successfully modified your application.**",
            ephemeral: true,
          })
        }
      } else {
        setApp(interaction.user, "[NO APPLICATION SUBMITTED]")
        interaction.reply({
          content: "✅ **Cleared your application successfully.** But don't worry, you're still in the election!",
          ephemeral: true,
        })
      }
    }
  }

  if (interaction.isAnySelectMenu()) {
    if (interaction.customId === 'voteSelect') {
      const users = interaction.values
      const usernames = [] // this is only used to display the people voted for, cosmetic purposes
      let data;
      if (fs.existsSync('./votes.json')) {
        data = JSON.parse(fs.readFileSync('./votes.json'));
      } else {
        data = {};
      }
    
      // Check if the user has already voted
      if (data.allVoters && data.allVoters.includes(interaction.user.username)) {
        return interaction.reply({
          content: "❌ **You have already voted!** Please ping an administrator if you think this is a mistake.",
          ephemeral: true,
        });
      }
    
      // Initialize allVoters array if it doesn't exist
      if (!data.allVoters) {
        data.allVoters = [];
      }
    
      // Add the user to the list of voters
      data.allVoters.push(interaction.user.username);
    
      // Process votes
      for (let i = 0; i < users.length; i++) {
        const member = interaction.guild.members.cache.get(users[i]);
        const username = member ? member.user.username : users[i]; // Fallback to user ID if member is not found
        usernames.push(username)

        if (data[username]) {
          data[username].votes++;
          data[username].voters.push(interaction.user.username);
        } else {
          data[username] = {};
          data[username].votes = 1;
          data[username].voters = [interaction.user.username];
        }
      }
    
      fs.writeFileSync('./votes.json', JSON.stringify(data, null, 2));
    
      interaction.reply({
        content: `✅ **You have successfully voted: *${usernames.join(", ")}*.** If you didn't mean to do this, ping an administrator. You are NOT guaranteed to get your vote back.`,
        ephemeral: true,
      })
    }
    
  }
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.TOKEN)