const config = require('../config');
const { welcomeEmbed } = require('../utils/embeds');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    if (!config.channels.welcome) return;

    const channel = await member.guild.channels.fetch(config.channels.welcome).catch(() => null);
    if (!channel) return;

    await channel.send({ content: `${member}`, embeds: [welcomeEmbed(member)] }).catch(() => null);
  },
};
