const { PermissionFlagsBits } = require('discord.js');
const config = require('../config');

function isAdmin(member) {
  if (!member) return false;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  if (config.roles.owner && member.roles.cache.has(config.roles.owner)) return true;
  return false;
}

function isStaff(member) {
  if (!member) return false;
  if (isAdmin(member)) return true;
  const staffRoles = [config.roles.helper, config.roles.support].filter(Boolean);
  return staffRoles.some((roleId) => member.roles.cache.has(roleId));
}

module.exports = { isAdmin, isStaff };
