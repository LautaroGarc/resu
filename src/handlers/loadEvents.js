const fs = require('fs');
const path = require('path');

function loadEvents(client) {
  const eventsPath = path.join(__dirname, '..', 'events');

  for (const file of fs.readdirSync(eventsPath)) {
    if (!file.endsWith('.js')) continue;
    const event = require(path.join(eventsPath, file));
    if (!event?.name || typeof event.execute !== 'function') continue;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

module.exports = { loadEvents };
