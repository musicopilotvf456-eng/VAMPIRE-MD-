// commands/deletestore.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'deletestore',
  description: 'Supprime un audio stocké',
  async execute({ client, message, args }) {
    try {
      if (!args[0]) {
        return client.sendMessage(message.from, { text: '❌ Tu dois préciser le nom de l’audio à supprimer. Exemple : !deletestore hehehe' });
      }

      const audioName = args.join('_');
      const filePath = path.join(__dirname, '../storage/audios', `${audioName}.mp3`);

      if (!fs.existsSync(filePath)) {
        return client.sendMessage(message.from, { text: `❌ Aucun audio trouvé avec le nom : ${audioName}` });
      }

      fs.unlinkSync(filePath);

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
🗑️ Audio supprimé : ${audioName}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error('Erreur deletestore.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la suppression de l’audio.' });
    }
  }
};// commands/deletestore.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'deletestore',
  description: 'Supprime un audio stocké',
  async execute({ client, message, args }) {
    try {
      if (!args[0]) {
        return client.sendMessage(message.from, { text: '❌ Tu dois préciser le nom de l’audio à supprimer. Exemple : !deletestore hehehe' });
      }

      const audioName = args.join('_');
      const filePath = path.join(__dirname, '../storage/audios', `${audioName}.mp3`);

      if (!fs.existsSync(filePath)) {
        return client.sendMessage(message.from, { text: `❌ Aucun audio trouvé avec le nom : ${audioName}` });
      }

      fs.unlinkSync(filePath);

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
🗑️ Audio supprimé : ${audioName}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error('Erreur deletestore.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la suppression de l’audio.' });
    }
  }
};
