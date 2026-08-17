const { createTicket } = require('../../utils/tickets');
const config = require('../../config');

module.exports = {
  match: (customId) => customId.startsWith('ticket_open_'),

  async execute(interaction) {
    const type = interaction.customId.replace('ticket_open_', '');

    if (!config.channels.ticketCategory) {
      await interaction.reply({ content: '❌ TICKET_CATEGORY_ID no esta configurado en el .env.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const { channel, alreadyExisted } = await createTicket({
      guild: interaction.guild,
      member: interaction.member,
      type,
    });

    await interaction.editReply({
      content: alreadyExisted
        ? `Ya tenes un ticket abierto: ${channel}`
        : `✅ Ticket creado: ${channel}`,
    });
  },
};
