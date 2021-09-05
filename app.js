// const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { Client, Intents, DiscordAPIError, Collection } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const fs = require('fs');

client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log('Bitch is online');
});

// const client = new Discord.Client();

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === 'clear') {
    client.commands.get('clear').execute(message, args);
  } else if (command === 'play') {
    console.log(client.commands);
    client.commands.get('play').execute(message, args);
  } else if (command === 'leave') {
    client.commands.get('leave').execute(message, args);
  }
});

client.login(token);
