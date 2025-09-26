// commands/tagall.js
module.exports = {
  name: 'tagall',
  description: 'Tag tous les membres du groupe avec 🌹',
  async execute({ client, message }) {
    try {
      // Vérifie si c'est un groupe
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande est réservée aux groupes.' });
      }

      // Récupère les infos du groupe
      const groupMetadata = await client.groupMetadata(message.from);
      const participants = groupMetadata.participants;

      // Vérifie si l'auteur est admin
      const author = participants.find(p => p.id === message.sender);
      if (!author?.admin) {
        return client.sendMessage(message.from, { text: '❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.' });
      }

      // Vérifie si le bot est admin
      const botNumber = (await client.info.wid).user + '@s.whatsapp.net';
      const botInfo = participants.find(p => p.id === botNumber);
      if (!botInfo?.admin) {
        return client.sendMessage(message.from, { text: '❌ Je dois être administrateur du groupe pour utiliser cette commande.' });
      }

      // Prépare la liste des mentions
      const mentions = participants.map(p => p.id);
      const tags = participants.map(p => `🌹 @${p.id.split('@')[0]}`).join('\n');

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // image du bot

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
${tags}
__________________________________
`;

      // Envoie du message avec image + mentions
      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: mentions
      });

    } catch (err) {
      console.error('Erreur dans tagall.js:', err);
      return client.sendMessage(message.from, { text: '❌ Impossible de taguer tous les membres du groupe.' });
    }
  }
};
