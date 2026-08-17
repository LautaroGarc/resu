const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const productsStore = require('../../utils/productsStore');
const { productAutocomplete } = require('../../utils/autocomplete');
const { resendProductEmbedIfExists } = require('../../utils/productEmbedSender');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('change-price')
    .setDescription('Cambia el precio de un producto.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt
        .setName('productid')
        .setDescription('Producto a modificar')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((opt) =>
      opt.setName('price').setDescription('Nuevo precio').setRequired(true)
    ),

  async autocomplete(interaction) {
    await productAutocomplete(interaction);
  },

  async execute(interaction) {
    const productId = interaction.options.getString('productid', true);
    const price = interaction.options.getString('price', true);

    const product = productsStore.getById(productId);
    if (!product) {
      await interaction.reply({ content: `❌ No encontre un producto con ID \`${productId}\`.`, ephemeral: true });
      return;
    }

    const updated = productsStore.update(productId, { price });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(config.colors.success)
          .setTitle('✅ Precio actualizado')
          .addFields(
            { name: 'ID', value: `\`${updated.id}\``, inline: true },
            { name: 'Nombre', value: updated.name, inline: true },
            { name: 'Precio', value: String(updated.price), inline: true }
          ),
      ],
    });

    await resendProductEmbedIfExists(interaction.client, updated);
  },
};
