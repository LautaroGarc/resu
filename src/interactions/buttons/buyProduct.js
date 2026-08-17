const productsStore = require('../../utils/productsStore');
const { createTicket } = require('../../utils/tickets');
const config = require('../../config');

module.exports = {
  match: (customId) => customId.startsWith('buy_'),

  async execute(interaction) {
    const productId = interaction.customId.replace('buy_', '');
    const product = productsStore.getById(productId);

    if (!product) {
      await interaction.reply({ content: '❌ Este producto ya no existe.', ephemeral: true });
      return;
    }

    if (!config.channels.ticketCategory) {
      await interaction.reply({ content: '❌ TICKET_CATEGORY_ID no esta configurado en el .env.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const { channel, alreadyExisted } = await createTicket({
      guild: interaction.guild,
      member: interaction.member,
      type: 'comprar',
      productName: product.name,
    });

    await interaction.editReply({
      content: alreadyExisted
        ? `Ya tenes un ticket abierto: ${channel}`
        : `✅ Ticket creado: ${channel}`,
    });
  },
};
