// utils/kickMember.js

module.exports = async function kickMember(client, jid, userId) {
  return await client.groupParticipantsUpdate(jid, [userId], "remove");
};
