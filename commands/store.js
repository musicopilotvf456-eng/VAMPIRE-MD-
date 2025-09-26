// commands/store.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'store',
  description: 'Enregistre un message vocal dans le stockage du bot avec un nom personnalisé',
  async execute({ client, message, args }) {
    try {
      if (!message.quoted || message.quoted.mtype !== 'audioMessage') {
        return client.sendMessage(message.from, { text: '❌ Réponds à un message vocal avec la commande : !store <nom>' });
      }

      if (!args[0]) {
        return client.sendMessage(message.from, { text: '❌ Tu dois donner un nom pour l’audio enregistré. Exemple : !store hehehe' });
      }

      const audioName = args.join('_'); // permet de garder un nom valide
      const saveDir = path.join(__dirname, '../storage/audios');

      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      // Téléchargement du message vocal
      const audioBuffer = await message.quoted.download();
      const filePath = path.join(saveDir, `${audioName}.mp3`);

      fs.writeFileSync(filePath, audioBuffer);

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
📥 Store succefuly 🎯
Nom : ${audioName}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error('Erreur store.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’enregistrement du message vocal.' });
    }
  }
};
