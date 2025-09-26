// commands/sticker.js
const { writeFile } = require('fs/promises');
const path = require('path');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
  name: 'sticker',
  description: 'Transforme une image ou une vidéo en sticker',
  async execute({ client, message }) {
    try {
      // Vérifie qu'il y a un média en réponse
      if (!message.quoted || !message.quoted.mtype) {
        return client.sendMessage(message.from, { text: '❌ Réponds à une image ou une vidéo pour en faire un sticker.' });
      }

      const mediaMessage = message.quoted;
      const buffer = await mediaMessage.download(); // Télécharge le média
      if (!buffer) {
        return client.sendMessage(message.from, { text: '❌ Impossible de télécharger le média.' });
      }

      // Crée le sticker avec wa-sticker-formatter
      const sticker = new Sticker(buffer, {
        pack: "✛ 𝐉𝐞𝐧𝐢𝐟𝐞𝐫 𝐱𝐦 𝐬𝐭𝐮𝐝𝐢𝐨✛", // nom du pack
        author: "༒𝐕𝐀𝐌𝐏𝐈𝐑𝐄 𝐌𝐃༒", // nom du sticker
        type: StickerTypes.FULL,
        quality: 80
      });

      const stickerBuffer = await sticker.build();

      await client.sendMessage(message.from, {
        sticker: stickerBuffer
      });

    } catch (err) {
      console.error('Erreur sticker.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la création du sticker.' });
    }
  }
};
