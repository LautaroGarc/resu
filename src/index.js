const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./handlers/loadCommands');
const { loadEvents } = require('./handlers/loadEvents');

if (!config.token) {
  console.error('❌ Falta DISCORD_TOKEN en el .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

loadCommands(client);
loadEvents(client);

client.login(config.token);
