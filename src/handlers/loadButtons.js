const fs = require('fs');
const path = require('path');

function loadButtons() {
  const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');
  const buttons = [];

  for (const file of fs.readdirSync(buttonsPath)) {
    if (!file.endsWith('.js')) continue;
    const handler = require(path.join(buttonsPath, file));
    if (typeof handler?.match === 'function' && typeof handler?.execute === 'function') {
      buttons.push(handler);
    }
  }

  return buttons;
}

module.exports = { loadButtons };
