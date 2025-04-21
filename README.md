# Vasildey Voting
Simple &amp; lightweight Discord bot for running moderator elections, containing an application-submitting and voting system. 

## Setup
1. Simply download the source code and install modules with:
```
npm install
```
2. Copy the `.env.example` and rename it to `.env`
3. In the newly created `.env` file, replace `REPLACE_WITH_BOT_TOKEN` with the Discord Bot token you intend on using
4. You can run the bot with:
```
node src/index
```

**NOTE: This is indended for use with smaller servers, because Discord's API only allows up to 25 users in the voting menu. I may code a workaround for this later, but that's how it is for now.**

Feel free to use my code without crediting me, I don't mind lol