const { EmbedBuilder } = require('discord.js');

const COLORS = {
  primary: 0x5865F2,
  success: 0x2DC770,
  warning: 0xFFAA00,
  error: 0xED4245,
  neutral: 0x2B2D31
};

function base(title, description, color = COLORS.primary) {
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setTimestamp();
}
function success(title, desc) { return base(title, desc, COLORS.success); }
function error(title, desc) { return base(title, desc, COLORS.error); }
function warning(title, desc) { return base(title, desc, COLORS.warning); }
function info(title, desc) { return base(title, desc, COLORS.primary); }

function permError(missing) {
  return error('Permission insuffisante', `Permissions requises : \`${missing.join(', ')}\``);
}

module.exports = { COLORS, base, success, error, warning, info, permError };
