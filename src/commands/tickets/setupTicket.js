const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { ticketPanelEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-ticket')
    .setDescription('Publica el panel de tickets en este canal.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_open_comprar')
        .setLabel('Comprar')
        .setEmoji('🛒')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('ticket_open_dudas')
        .setLabel('Dudas')
        .setEmoji('❓')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('ticket_open_partner')
        .setLabel('Partner')
        .setEmoji('💌')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.channel.send({ embeds: [ticketPanelEmbed()], components: [row] });
    await interaction.reply({ content: '✅ Panel de tickets publicado.', ephemeral: true });
  },
};
