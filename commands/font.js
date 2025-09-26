// commands/font.js
const stylishFonts = require('../utils/stylishFonts');

module.exports = {
  name: 'font',
  description: 'Transforme un message en plusieurs polices stylisées',
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return { text: '❌ Utilisation : !font <message>' };
      }

      const text = args.join(' ');
      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // image du bot

      // Génération des variantes de texte
      const variations = stylishFonts(text);

      const caption = `✨ *Voici ton texte en différentes polices :*\n\n${variations.join('\n')}`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption
      });
    } catch (err) {
      console.error('Erreur dans font.js:', err);
      return { text: '❌ Impossible de générer les polices.' };
    }
  }
};
