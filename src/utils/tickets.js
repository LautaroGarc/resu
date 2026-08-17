const {
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const config = require('../config');
const { ticketWaitingEmbed, TICKET_TYPES } = require('./embeds');

function ticketControlsRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Cerrar ticket')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('ticket_delete')
      .setLabel('Eliminar')
      .setEmoji('🗑️')
      .setStyle(ButtonStyle.Danger)
  );
}

function sanitize(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20) || 'user';
}

async function findExistingTicket(guild, userId) {
  const category = config.channels.ticketCategory;
  return guild.channels.cache.find(
    (c) =>
      c.parentId === category &&
      c.type === ChannelType.GuildText &&
      c.topic === `ticket-owner:${userId}`
  );
}

async function createTicket({ guild, member, type, productName }) {
  const existing = await findExistingTicket(guild, member.id);
  if (existing) return { channel: existing, alreadyExisted: true };

  const typeInfo = TICKET_TYPES[type] ?? { label: type, emoji: '🎫' };

  const overwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    {
      id: member.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles,
      ],
    },
  ];

  for (const roleId of [config.roles.helper, config.roles.support, config.roles.owner]) {
    if (roleId) {
      overwrites.push({
        id: roleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      });
    }
  }

  const channel = await guild.channels.create({
    name: `${typeInfo.emoji}-${type}-${sanitize(member.user.username)}`,
    type: ChannelType.GuildText,
    parent: config.channels.ticketCategory || undefined,
    topic: `ticket-owner:${member.id}`,
    permissionOverwrites: overwrites,
  });

  const mentionRoles = [config.roles.helper, config.roles.support, config.roles.owner]
    .filter(Boolean)
    .map((id) => `<@&${id}>`)
    .join(' ');

  await channel.send({
    content: `${member} ${mentionRoles}`.trim(),
    embeds: [ticketWaitingEmbed({ opener: member.toString(), type, productName })],
    components: [ticketControlsRow()],
  });

  return { channel, alreadyExisted: false };
}

module.exports = { createTicket, ticketControlsRow, findExistingTicket };
