const productsStore = require('./productsStore');

async function productAutocomplete(interaction) {
  const focused = interaction.options.getFocused();
  const matches = productsStore.search(focused).slice(0, 25);
  await interaction.respond(
    matches.map((p) => ({
      name: `${p.name} (${p.id}) - ${p.price}`.slice(0, 100),
      value: p.id,
    }))
  );
}

module.exports = { productAutocomplete };
