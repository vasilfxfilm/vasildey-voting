const fs = require('fs')

module.exports = async (interaction, client) => {

  if (interaction.isAnySelectMenu()) {
    if (interaction.customId === 'voteSelect') {
      const users = interaction.values
      const usernames = [] // this is only used to display the people voted for, cosmetic purposes
      let data;
      if (fs.existsSync(`./data/${interaction.guild.id}/votes.json`)) {
        data = JSON.parse(fs.readFileSync(`./data/${interaction.guild.id}/votes.json`));
      } else {
        data = {};
      }
    
      // Check if the user has already voted
      if (data.allVoters && data.allVoters.includes(interaction.user.username)) {
        return interaction.reply({
          content: "❌ **You have already voted!** Please ping an Administrator if you think this is a mistake.",
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
    
      fs.writeFileSync(`./data/${interaction.guild.id}/votes.json`, JSON.stringify(data, null, 2));
    
      interaction.reply({
        content: `✅ **You have successfully voted: *${usernames.join(", ")}*.** You can not change your vote.`,
        ephemeral: true,
      })
    }
    
  }

}