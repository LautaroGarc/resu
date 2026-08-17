const { loadButtons } = require('../handlers/loadButtons');

const buttons = loadButtons();

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction);
        return;
      }

      if (interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command || typeof command.autocomplete !== 'function') return;
        await command.autocomplete(interaction);
        return;
      }

      if (interaction.isButton()) {
        const handler = buttons.find((b) => b.match(interaction.customId));
        if (!handler) return;
        await handler.execute(interaction);
        return;
      }
    } catch (error) {
      console.error('Error manejando interaccion:', error);
      const payload = { content: '❌ Ocurrio un error al procesar la interaccion.', ephemeral: true };
      if (interaction.isRepliable()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(payload).catch(() => null);
        } else {
          await interaction.reply(payload).catch(() => null);
        }
      }
    }
  },
};
