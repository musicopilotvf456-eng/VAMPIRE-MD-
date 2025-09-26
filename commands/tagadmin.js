// commands/tagadmin.js
module.exports = {
  name: 'tagadmin',
  description: 'Tague tous les administrateurs du groupe avec 👀',
  async execute({ client, message }) {
    try {
      // Vérifie si c'est dans un groupe
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande est réservée aux groupes.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const participants = groupMetadata.participants;

      // Filtre uniquement les admins
      const admins = participants.filter(p => p.admin).map(p => p.id);

      if (admins.length === 0) {
        return client.sendMessage(message.from, { text: '⚠️ Aucun administrateur trouvé dans ce groupe.' });
      }

      // Prépare les tags 👀
      const tags = admins.map(admin => `👀 @${admin.split('@')[0]}`).join('\n');

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // Image du bot

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

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: admins
      });

    } catch (err) {
      console.error('Erreur dans tagadmin.js:', err);
      return client.sendMessage(message.from, { text: '❌ Impossible de taguer les administrateurs.' });
    }
  }
};
