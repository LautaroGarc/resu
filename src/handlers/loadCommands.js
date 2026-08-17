const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commands = new Map();

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.js')) {
        const command = require(fullPath);
        if (command?.data?.name && typeof command.execute === 'function') {
          commands.set(command.data.name, command);
        }
      }
    }
  }

  walk(commandsPath);
  client.commands = commands;
  return commands;
}

module.exports = { loadCommands };
