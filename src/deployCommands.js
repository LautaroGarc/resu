const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./handlers/loadCommands');

const fakeClient = {};
const commands = loadCommands(fakeClient);
const body = [...commands.values()].map((c) => c.data.toJSON());

if (!config.token || !config.clientId) {
  console.error('❌ Falta DISCORD_TOKEN o CLIENT_ID en el .env');
  process.exit(1);
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    const route = config.guildId
      ? Routes.applicationGuildCommands(config.clientId, config.guildId)
      : Routes.applicationCommands(config.clientId);

    await rest.put(route, { body });

    console.log(
      `✅ ${body.length} comando(s) registrados ${config.guildId ? `en el servidor ${config.guildId}` : 'globalmente'}.`
    );
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
})();
