// commands/delete.js
module.exports = {
  name: 'delete',
  description: 'Supprime un message en réponse (réservé aux admins)',
  async execute({ client, message }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande est réservée aux groupes.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const participants = groupMetadata.participants;

      // Vérifier si l'utilisateur qui utilise la commande est admin
      const isUserAdmin = participants.find(
        p => p.id === message.sender && (p.admin === 'admin' || p.admin === 'superadmin')
      );
      if (!isUserAdmin) {
        return client.sendMessage(message.from, { text: '🔒 Seuls les administrateurs peuvent utiliser cette commande.' });
      }

      // Vérifier si le bot est admin
      const botId = client.user?.id;
      const isBotAdmin = participants.find(
        p => p.id.includes(botId.split(':')[0]) && (p.admin === 'admin' || p.admin === 'superadmin')
      );
      if (!isBotAdmin) {
        return client.sendMessage(message.from, { text: '❌ Je dois être administrateur du groupe pour supprimer des messages.' });
      }

      // Vérifier si on répond à un message
      if (!message.quoted) {
        return client.sendMessage(message.from, { text: '⚠️ Répondez au message que vous voulez supprimer.' });
      }

      // Supprimer le message ciblé
      await client.sendMessage(message.from, {
        delete: {
          remoteJid: message.from,
          fromMe: false,
          id: message.quoted.id,
          participant: message.quoted.sender
        }
      });

      // Réponse visuelle (confirmation)
      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________

🗑️ Message supprimé avec succès par @${message.sender.split('@')[0]}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: [message.sender]
      });

    } catch (err) {
      console.error('Erreur dans delete.js:', err);
      return client.sendMessage(message.from, { text: '❌ Impossible de supprimer ce message.' });
    }
  }
};
