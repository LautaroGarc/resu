const { SlashCommandBuilder } = require('discord.js');
const { paymentsEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payments')
    .setDescription('Muestra los metodos de pago disponibles.'),

  async execute(interaction) {
    await interaction.reply({ embeds: [paymentsEmbed()] });
  },
};
