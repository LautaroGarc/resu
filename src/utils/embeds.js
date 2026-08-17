const { EmbedBuilder } = require('discord.js');
const config = require('../config');

const TICKET_TYPES = {
  comprar: { label: 'Comprar', emoji: '🛒' },
  dudas: { label: 'Dudas', emoji: '❓' },
  partner: { label: 'Partner', emoji: '💌' },
};

function ticketPanelEmbed() {
  const embed = new EmbedBuilder()
    .setColor(config.colors.ticket)
    .setTitle('🎫 Ticket System - Resubidos')
    .setDescription(
      [
        '🛒 **Comprar** - productos, servicios y disponibilidad.',
        '❓ **Dudas** - preguntas, soporte e informacion general.',
        '💌 **Partner** - propuestas de colaboracion o partnership.',
        '',
        'Pulsa el boton de abajo para empezar.',
      ].join('\n')
    )
    .setFooter({ text: config.footerText });
  return embed;
}

function ticketWaitingEmbed({ opener, type, productName }) {
  const typeInfo = TICKET_TYPES[type] ?? { label: type, emoji: '🎫' };
  const lines = [
    `Gracias por abrir un ticket, ${opener}.`,
    'Un miembro del staff te va a atender en breve.',
    '',
    `**Tipo:** ${typeInfo.emoji} ${typeInfo.label}`,
  ];
  if (productName) lines.push(`**Producto:** ${productName}`);
  return new EmbedBuilder()
    .setColor(config.colors.ticket)
    .setTitle('🎫 Ticket abierto')
    .setDescription(lines.join('\n'))
    .setFooter({ text: config.footerText })
    .setTimestamp();
}

function ticketClosedEmbed({ closedBy }) {
  return new EmbedBuilder()
    .setColor(config.colors.ticket)
    .setTitle('🔒 Ticket cerrado')
    .setDescription(`Este ticket fue cerrado por ${closedBy}.`)
    .setFooter({ text: config.footerText })
    .setTimestamp();
}

function rulesEmbed() {
  const embed = new EmbedBuilder()
    .setColor(config.colors.rules)
    .setTitle('✅ Normas - Resubidos')
    .setDescription(
      [
        '**1. Respeto ante todo**',
        'No insultos, amenazas, acoso, toxicidad ni faltas de respeto.',
        '',
        '**2. No spam ni flood**',
        'Evita repetir mensajes, menciones innecesarias, publicidad o enlaces sospechosos.',
        '',
        '**3. Usa cada canal para su funcion**',
        'Manten dudas, compras, tickets y charla en sus canales correspondientes.',
        '',
        '**4. No contenido ilegal, NSFW o peligroso**',
        'Cualquier contenido que incumpla Discord sera eliminado.',
        '',
        '**5. Sigue las indicaciones del staff**',
        'El staff puede moderar, mover, borrar o sancionar si es necesario.',
        '',
        '**6. Tickets con informacion clara**',
        'Explica bien tu caso y espera respuesta sin insistir.',
        '',
        '**7. Espera tras pagar**',
        'Cuando realices el pago deberas esperar hasta que nuestros proveedores respondan.',
        '',
        'Entrar y participar en el servidor implica aceptar estas normas.',
      ].join('\n')
    )
    .setFooter({ text: config.serverName });
  return embed;
}

function welcomeEmbed(member) {
  const rulesLine = config.channels.rules ? `<#${config.channels.rules}>` : '#normas';
  const ticketLine = config.channels.ticketPanel ? `<#${config.channels.ticketPanel}>` : '#ticket';
  const embed = new EmbedBuilder()
    .setColor(config.colors.welcome)
    .setTitle(`👋 Bienvenido a /${config.serverName} $hop`)
    .setDescription(
      [
        `${member}, ya formas parte de la comunidad.`,
        '',
        `✅ Lee las normas: ${rulesLine}`,
        `🎫 Abre ticket si necesitas ayuda: ${ticketLine}`,
        '',
        `Ahora somos ${member.guild.memberCount} miembros.`,
      ].join('\n')
    )
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: config.serverName })
    .setTimestamp();
  return embed;
}

function productEmbed(product, { imageLink, productInfo } = {}) {
  const embed = new EmbedBuilder()
    .setColor(config.colors.product)
    .setTitle(product.name)
    .addFields({ name: 'Precio | Price', value: String(product.price) })
    .setFooter({ text: `${config.serverName} Shop` })
    .setTimestamp();

  if (productInfo) embed.setDescription(productInfo.replace(/\\n/g, '\n'));
  if (imageLink) embed.setImage(imageLink);
  if (config.images.productDefaultThumbnail) embed.setThumbnail(config.images.productDefaultThumbnail);

  return embed;
}

function deliveryEmbed({ product, key, deliveredBy }) {
  return new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle('✅ Entrega confirmada')
    .setDescription(
      [
        `Gracias por tu compra.`,
        '',
        `**Producto:** ${product.name}`,
        `**Key:**`,
        '```',
        key,
        '```',
      ].join('\n')
    )
    .setFooter({ text: `Entregado por ${deliveredBy}` })
    .setTimestamp();
}

function paymentsEmbed() {
  return new EmbedBuilder()
    .setColor(config.colors.ticket)
    .setTitle('💳 Metodos de pago')
    .setDescription('Proximamente. Por ahora, abri un ticket de **Comprar** para consultar como pagar.')
    .setFooter({ text: config.footerText });
}

module.exports = {
  TICKET_TYPES,
  ticketPanelEmbed,
  ticketWaitingEmbed,
  ticketClosedEmbed,
  rulesEmbed,
  welcomeEmbed,
  productEmbed,
  deliveryEmbed,
  paymentsEmbed,
};
