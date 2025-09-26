// commands/take.js
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
  name: 'take',
  description: 'Copie et renvoie un sticker en répondant à ce sticker',
  async execute({ client, message }) {
    try {
      // Vérifie que la commande répond à un sticker
      if (!message.quoted || message.quoted.mtype !== 'stickerMessage') {
        return client.sendMessage(message.from, { text: '❌ Réponds à un sticker pour le copier.' });
      }

      // Télécharge le sticker en buffer
      const stickerBuffer = await message.quoted.download();
      if (!stickerBuffer) {
        return client.sendMessage(message.from, { text: '❌ Impossible de télécharger le sticker.' });
      }

      // Recrée le sticker avec ton pack/nom personnalisé
      const newSticker = new Sticker(stickerBuffer, {
        pack: "✛ 𝐉𝐞𝐧𝐢𝐟𝐞𝐫 𝐱𝐦 𝐬𝐭𝐮𝐝𝐢𝐨✛", // même pack que sticker.js
        author: "༒𝐕𝐀𝐌𝐏𝐈𝐑𝐄 𝐌𝐃༒", // même auteur que sticker.js
        type: StickerTypes.FULL,
        quality: 80
      });

      const finalSticker = await newSticker.build();

      await client.sendMessage(message.from, {
        sticker: finalSticker
      });

    } catch (err) {
      console.error('Erreur take.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la copie du sticker.' });
    }
  }
};
