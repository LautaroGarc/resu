const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { productEmbed } = require('./embeds');
const productsStore = require('./productsStore');

function buyButtonRow(productId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`buy_${productId}`)
      .setLabel('Compra Aqui / Buy Here')
      .setEmoji('🛒')
      .setStyle(ButtonStyle.Success)
  );
}

async function sendProductEmbed(channel, product, { imageLink, productInfo }) {
  const message = await channel.send({
    embeds: [productEmbed(product, { imageLink, productInfo })],
    components: [buyButtonRow(product.id)],
  });

  productsStore.update(product.id, {
    embedChannelId: channel.id,
    embedMessageId: message.id,
    embedImageLink: imageLink,
    embedProductInfo: productInfo,
  });

  return message;
}

async function resendProductEmbedIfExists(client, product) {
  if (!product.embedChannelId || !product.embedMessageId) return false;

  try {
    const channel = await client.channels.fetch(product.embedChannelId);
    const oldMessage = await channel.messages.fetch(product.embedMessageId).catch(() => null);
    if (oldMessage) await oldMessage.delete().catch(() => null);

    await sendProductEmbed(channel, product, {
      imageLink: product.embedImageLink,
      productInfo: product.embedProductInfo,
    });
    return true;
  } catch {
    return false;
  }
}

module.exports = { sendProductEmbed, resendProductEmbedIfExists, buyButtonRow };
