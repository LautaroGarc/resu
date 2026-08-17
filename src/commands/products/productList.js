const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const productsStore = require('../../utils/productsStore');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('product-list')
    .setDescription('Muestra la lista completa de productos y sus IDs.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const products = productsStore.getAll();

    if (products.length === 0) {
      await interaction.reply({ content: 'Todavia no hay productos creados. Usa `/create`.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.ticket)
      .setTitle('📦 Lista de productos')
      .setDescription(
        products
          .map((p) => `\`${p.id}\` · **${p.name}** — ${p.price}`)
          .join('\n')
      )
      .setFooter({ text: `${products.length} producto(s)` });

    await interaction.reply({ embeds: [embed] });
  },
};
