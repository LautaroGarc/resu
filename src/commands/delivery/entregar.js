const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const productsStore = require('../../utils/productsStore');
const { productAutocomplete } = require('../../utils/autocomplete');
const { deliveryEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('entregar')
    .setDescription('Entrega la key de un producto en este canal.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt
        .setName('producto')
        .setDescription('Producto entregado')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((opt) => opt.setName('key').setDescription('Key a entregar').setRequired(true)),

  async autocomplete(interaction) {
    await productAutocomplete(interaction);
  },

  async execute(interaction) {
    const productId = interaction.options.getString('producto', true);
    const key = interaction.options.getString('key', true);

    const product = productsStore.getById(productId);
    if (!product) {
      await interaction.reply({ content: `❌ No encontre un producto con ID \`${productId}\`.`, ephemeral: true });
      return;
    }

    await interaction.reply({
      embeds: [deliveryEmbed({ product, key, deliveredBy: interaction.user })],
    });
  },
};
