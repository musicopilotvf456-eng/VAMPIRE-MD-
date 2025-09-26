// commands/convertTomp3.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: 'convertTomp3',
  description: 'Convertit une vidéo (mp4) en audio (mp3)',
  async execute({ client, message }) {
    try {
      // Vérifie si on répond à une vidéo
      if (!message.quoted || message.quoted.mtype !== 'videoMessage') {
        return client.sendMessage(message.from, { text: '❌ Réponds à une vidéo pour la convertir en mp3.' });
      }

      // Télécharge la vidéo
      const videoBuffer = await message.quoted.download();
      if (!videoBuffer) {
        return client.sendMessage(message.from, { text: '❌ Impossible de télécharger la vidéo.' });
      }

      // Sauvegarde temporairement la vidéo
      const inputPath = path.join(__dirname, `../temp/input_${Date.now()}.mp4`);
      const outputPath = path.join(__dirname, `../temp/output_${Date.now()}.mp3`);
      fs.writeFileSync(inputPath, videoBuffer);

      // Utilise ffmpeg pour convertir en MP3
      exec(`ffmpeg -i "${inputPath}" -vn -ar 44100 -ac 2 -b:a 192k "${outputPath}"`, async (err) => {
        if (err) {
          console.error('Erreur FFMPEG:', err);
          return client.sendMessage(message.from, { text: '❌ Erreur lors de la conversion en mp3.' });
        }

        // Envoie le fichier audio
        const mp3Buffer = fs.readFileSync(outputPath);
        await client.sendMessage(message.from, {
          audio: mp3Buffer,
          mimetype: 'audio/mpeg',
          ptt: false // mettre true si tu veux que ça sorte comme un vocal
        });

        // Nettoyage des fichiers temporaires
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });

    } catch (err) {
      console.error('Erreur convertTomp3.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la conversion.' });
    }
  }
};
