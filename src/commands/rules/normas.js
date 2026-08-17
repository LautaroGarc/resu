const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { rulesEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('normas')
    .setDescription('Envia el embed de normas del servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    await interaction.reply({ embeds: [rulesEmbed()] });
  },
};
