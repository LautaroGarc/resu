require('dotenv').config();

function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

module.exports = {
  token: env('DISCORD_TOKEN'),
  clientId: env('CLIENT_ID'),
  guildId: env('GUILD_ID'),

  roles: {
    helper: env('ROLE_HELPER_ID'),
    support: env('ROLE_SUPPORT_ID'),
    owner: env('ROLE_OWNER_ID'),
  },

  channels: {
    ticketCategory: env('TICKET_CATEGORY_ID'),
    feedback: env('FEEDBACK_CHANNEL_ID'),
    welcome: env('WELCOME_CHANNEL_ID'),
    rules: env('RULES_CHANNEL_ID'),
    ticketPanel: env('TICKET_PANEL_CHANNEL_ID'),
  },

  images: {
    productDefaultThumbnail: env('PRODUCT_DEFAULT_THUMBNAIL_URL') || null,
  },

  serverName: env('SERVER_NAME', 'Resubidos'),
  footerText: env('EMBED_FOOTER_TEXT', 'Resubidos Support'),

  colors: {
    ticket: 0x2b2d31,
    rules: 0x57f287,
    welcome: 0x5865f2,
    product: 0xed4245,
    success: 0x57f287,
    danger: 0xed4245,
  },
};
