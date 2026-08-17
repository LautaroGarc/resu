module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Conectado como ${client.user.tag}`);
  },
};
