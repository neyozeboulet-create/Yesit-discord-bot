const { PermissionFlagsBits } = require('discord.js');

function hasPerm(member, perm) {
  if (!member) return false;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  return member.permissions.has(perm);
}
function botHasPerm(guild, perm) {
  const me = guild.members.me;
  if (!me) return false;
  return me.permissions.has(perm);
}
function checkHierarchy(actor, target) {
  if (target.id === actor.guild.ownerId) return false;
  if (actor.id === actor.guild.ownerId) return true;
  return actor.roles.highest.position > target.roles.highest.position;
}
function canModerate(interaction, targetMember, requiredPerm) {
  if (!hasPerm(interaction.member, requiredPerm)) return { ok: false, reason: `Permission \`${requiredPerm}\` requise` };
  if (targetMember) {
    if (!checkHierarchy(interaction.member, targetMember)) return { ok: false, reason: 'Hiérarchie insuffisante' };
    if (!checkHierarchy(interaction.guild.members.me, targetMember)) return { ok: false, reason: 'Le bot ne peut pas modérer ce membre' };
  }
  if (!botHasPerm(interaction.guild, requiredPerm)) return { ok: false, reason: 'Le bot manque de permissions' };
  return { ok: true };
}

module.exports = { hasPerm, botHasPerm, checkHierarchy, canModerate, PermissionFlagsBits };
