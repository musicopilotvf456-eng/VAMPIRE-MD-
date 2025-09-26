// commands/delgroup.js
module.exports = {
  name: 'delgroup',
  description: 'Supprimer le groupe et exclure ses membres',
  async execute({ client, message }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande fonctionne uniquement dans un groupe.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const isBotAdmin = groupMetadata.participants.find(p => p.id === client.user.id && p.admin);
      if (!isBotAdmin) {
        return client.sendMessage(message.from, { text: '❌ Je dois être admin pour supprimer un groupe.' });
      }

      const isUserAdmin = groupMetadata.participants.find(p => p.id === message.sender && p.admin);
      if (!isUserAdmin) {
        return client.sendMessage(message.from, { text: '❌ Seuls les administrateurs peuvent supprimer le groupe.' });
      }

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
process enclenché ⏱️
Hello everyone 🗣️❤️‍🩹
C'était un grand plaisir de discuter avec vous tous 🥹
Bye 🌹 adios 👋🏼 
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption,
        mentions: groupMetadata.participants.map(p => p.id)
      });

      // Attente avant suppression pour laisser le message s'afficher
      await new Promise(res => setTimeout(res, 5000));

      // Kick tous les membres sauf le bot (option : garde les admins)
      const membersToKick = groupMetadata.participants
        .filter(p => p.id !== client.user.id) // garde le bot
        .map(p => p.id);

      for (const member of membersToKick) {
        await client.groupParticipantsUpdate(message.from, [member], 'remove');
        await new Promise(res => setTimeout(res, 500)); // petite pause entre les kicks
      }

      // Quitter le groupe après avoir expulsé tout le monde
      await client.groupLeave(message.from);

      // Supprimer le groupe de la liste du bot (si l'API le permet)
      if (client.groupDelete) {
        await client.groupDelete(message.from);
      }

    } catch (err) {
      console.error('Erreur delgroup.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la suppression du groupe.' });
    }
  }
};
