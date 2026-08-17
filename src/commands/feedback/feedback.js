const { SlashCommandBuilder, PermissionFlagsBits, MessageReferenceType } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Reenvia un mensaje al canal de feedback.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt.setName('messageid').setDescription('ID del mensaje a reenviar').setRequired(true)
    ),

  async execute(interaction) {
    const messageId = interaction.options.getString('messageid', true);

    if (!config.channels.feedback) {
      await interaction.reply({ content: '❌ No configuraste FEEDBACK_CHANNEL_ID en el .env.', ephemeral: true });
      return;
    }

    const message = await interaction.channel.messages.fetch(messageId).catch(() => null);
    if (!message) {
      await interaction.reply({
        content: '❌ No encontre ese mensaje en este canal. Corre el comando en el mismo canal donde esta el mensaje.',
        ephemeral: true,
      });
      return;
    }

    const feedbackChannel = await interaction.client.channels.fetch(config.channels.feedback).catch(() => null);
    if (!feedbackChannel) {
      await interaction.reply({ content: '❌ No pude acceder al canal de feedback configurado.', ephemeral: true });
      return;
    }

    try {
      if (typeof message.forward === 'function') {
        await message.forward(feedbackChannel);
      } else {
        await feedbackChannel.send({
          message_reference: {
            message_id: message.id,
            channel_id: message.channelId,
            guild_id: message.guildId,
            type: MessageReferenceType.Forward,
          },
        });
      }
      await interaction.reply({ content: `✅ Mensaje reenviado a <#${config.channels.feedback}>.`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ No pude reenviar el mensaje: ${error.message}`, ephemeral: true });
    }
  },
};
