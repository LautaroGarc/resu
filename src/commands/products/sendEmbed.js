const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const productsStore = require('../../utils/productsStore');
const { productAutocomplete } = require('../../utils/autocomplete');
const { sendProductEmbed } = require('../../utils/productEmbedSender');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send-embed')
    .setDescription('Envia el embed de un producto en este canal.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt
        .setName('productid')
        .setDescription('Producto a mostrar')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((opt) =>
      opt.setName('imagelink').setDescription('URL de la imagen del producto').setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName('productinfo')
        .setDescription('Descripcion del producto (usa \\n para saltos de linea)')
        .setRequired(true)
    ),

  async autocomplete(interaction) {
    await productAutocomplete(interaction);
  },

  async execute(interaction) {
    const productId = interaction.options.getString('productid', true);
    const imageLink = interaction.options.getString('imagelink', true);
    const productInfo = interaction.options.getString('productinfo', true);

    const product = productsStore.getById(productId);
    if (!product) {
      await interaction.reply({ content: `❌ No encontre un producto con ID \`${productId}\`.`, ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    await sendProductEmbed(interaction.channel, product, { imageLink, productInfo });
    await interaction.editReply({ content: '✅ Embed enviado.' });
  },
};
