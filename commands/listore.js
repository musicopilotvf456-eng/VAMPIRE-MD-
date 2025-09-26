// commands/liststore.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'liststore',
  description: 'Liste tous les audios enregistrés',
  async execute({ client, message }) {
    try {
      const saveDir = path.join(__dirname, '../storage/audios');
      if (!fs.existsSync(saveDir)) {
        return client.sendMessage(message.from, { text: '📂 Aucun audio enregistré pour le moment.' });
      }

      const files = fs.readdirSync(saveDir).filter(f => f.endsWith('.mp3'));
      if (files.length === 0) {
        return client.sendMessage(message.from, { text: '📂 Aucun audio enregistré pour le moment.' });
      }

      const audioList = files.map((f, i) => `🎵 ${i + 1}. ${f.replace('.mp3', '')}`).join('\n');

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🎶 Audios enregistrés :
${audioList}
__________________________________
Total : ${files.length} audios
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error('Erreur liststore.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la récupération des audios.' });
    }
  }
};
