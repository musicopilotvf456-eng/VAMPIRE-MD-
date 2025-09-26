// commands/vv.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'vv',
  description: 'Extrait et renvoie un média en vu unique',
  async execute({ client, message }) {
    try {
      if (!message.quoted || !['viewOnceMessageV2', 'viewOnceMessage'].includes(message.quoted.mtype)) {
        return client.sendMessage(message.from, { text: '❌ Réponds à un média en *vu unique*.' });
      }

      // Détecte si c'est une image ou une vidéo
      const mediaMessage = message.quoted.message;
      const mediaType = mediaMessage.imageMessage ? 'image' : mediaMessage.videoMessage ? 'video' : null;

      if (!mediaType) {
        return client.sendMessage(message.from, { text: '❌ Média non pris en charge.' });
      }

      // Télécharge le média
      const mediaBuffer = await message.quoted.download();
      if (!mediaBuffer) {
        return client.sendMessage(message.from, { text: '❌ Impossible de télécharger le média.' });
      }

      // Crée un chemin temporaire
      const fileExt = mediaType === 'image' ? 'jpg' : 'mp4';
      const tempFilePath = path.join(__dirname, `../temp/vv_${Date.now()}.${fileExt}`);
      fs.writeFileSync(tempFilePath, mediaBuffer);

      // Envoie le média comme un fichier normal
      await client.sendMessage(message.from, {
        [mediaType]: fs.readFileSync(tempFilePath),
        caption: '👀 Média extrait avec succès ✅'
      });

      // Supprime le fichier temporaire
      fs.unlinkSync(tempFilePath);

    } catch (err) {
      console.error('Erreur vv.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’extraction du média en vu unique.' });
    }
  }
};
