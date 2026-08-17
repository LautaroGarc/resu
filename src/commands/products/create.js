const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const productsStore = require('../../utils/productsStore');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Crea un nuevo producto.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt.setName('name').setDescription('Nombre del producto').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('price').setDescription('Precio del producto').setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString('name', true);
    const price = interaction.options.getString('price', true);

    const product = productsStore.create(name, price);

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('✅ Producto creado')
      .addFields(
        { name: 'ID', value: `\`${product.id}\``, inline: true },
        { name: 'Nombre', value: product.name, inline: true },
        { name: 'Precio', value: String(product.price), inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
