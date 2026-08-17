const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'products.json');

function readAll() {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, 'utf8').trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function writeAll(products) {
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(products, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

function generateId() {
  return crypto.randomBytes(3).toString('hex');
}

function getAll() {
  return readAll();
}

function getById(id) {
  return readAll().find((p) => p.id === id) || null;
}

function create(name, price) {
  const products = readAll();
  const product = {
    id: generateId(),
    name,
    price,
    embedMessageId: null,
    embedChannelId: null,
    createdAt: Date.now(),
  };
  products.push(product);
  writeAll(products);
  return product;
}

function update(id, changes) {
  const products = readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...changes };
  writeAll(products);
  return products[index];
}

function search(query) {
  const q = query.toLowerCase();
  return readAll().filter(
    (p) => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
  );
}

module.exports = { getAll, getById, create, update, search };
