const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { isStaff, isAdmin } = require('../../utils/permissions');
const { ticketClosedEmbed } = require('../../utils/embeds');

function getOwnerId(channel) {
  const match = /^ticket-owner:(\d+)$/.exec(channel.topic ?? '');
  return match ? match[1] : null;
}

function reopenedRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_close').setLabel('Cerrar ticket').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_delete').setLabel('Eliminar').setEmoji('🗑️').setStyle(ButtonStyle.Danger)
  );
}

function closedRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_reopen').setLabel('Reabrir').setEmoji('🔓').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ticket_delete').setLabel('Eliminar').setEmoji('🗑️').setStyle(ButtonStyle.Danger)
  );
}

module.exports = {
  match: (customId) => ['ticket_close', 'ticket_reopen', 'ticket_delete'].includes(customId),

  async execute(interaction) {
    const { customId, channel, member } = interaction;
    const ownerId = getOwnerId(channel);

    if (!ownerId) {
      await interaction.reply({ content: '❌ Este canal no parece ser un ticket valido.', ephemeral: true });
      return;
    }

    if (customId === 'ticket_close') {
      if (!isStaff(member) && member.id !== ownerId) {
        await interaction.reply({ content: '❌ No tenes permisos para cerrar este ticket.', ephemeral: true });
        return;
      }
      await channel.permissionOverwrites.edit(ownerId, { SendMessages: false });
      await interaction.reply({ embeds: [ticketClosedEmbed({ closedBy: interaction.user })], components: [closedRow()] });
      if (!channel.name.startsWith('cerrado-')) {
        await channel.setName(`cerrado-${channel.name}`.slice(0, 100)).catch(() => null);
      }
      return;
    }

    if (customId === 'ticket_reopen') {
      if (!isStaff(member)) {
        await interaction.reply({ content: '❌ No tenes permisos para reabrir este ticket.', ephemeral: true });
        return;
      }
      await channel.permissionOverwrites.edit(ownerId, { SendMessages: true });
      if (channel.name.startsWith('cerrado-')) {
        await channel.setName(channel.name.replace(/^cerrado-/, '')).catch(() => null);
      }
      await interaction.reply({ content: `🔓 Ticket reabierto por ${interaction.user}.`, components: [reopenedRow()] });
      return;
    }

    if (customId === 'ticket_delete') {
      if (!isAdmin(member)) {
        await interaction.reply({ content: '❌ Solo un administrador puede eliminar el ticket.', ephemeral: true });
        return;
      }
      await interaction.reply({ content: '🗑️ Eliminando ticket en 5 segundos...' });
      setTimeout(() => {
        channel.delete().catch(() => null);
      }, 5000);
    }
  },
};
