// utils/isAdmin.js

module.exports = async function isAdmin(client, message) {
  if (!message.isGroup) return false;
  const groupMetadata = await client.groupMetadata(message.from);
  const admins = groupMetadata.participants.filter(p => p.admin);
  return admins.some(a => a.id === message.sender);
};
