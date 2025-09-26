.// commands/getpp.js
module.exports = {
  name: 'getpp',
  description: 'Télécharge et envoie la photo de profil de la personne ciblée',
  async execute({ client, message }) {
    try {
      if (!message.quoted) {
        return client.sendMessage(message.from, { text: '❌ Réponds au message de la personne dont tu veux la photo de profil.' });
      }

      const targetId = message.quoted.sender;

      // Récupération de la photo de profil
      let ppUrl;
      try {
        ppUrl = await client.profilePictureUrl(targetId, 'image');
      } catch {
        return client.sendMessage(message.from, { text: '❌ Cette personne n’a pas de photo de profil visible.' });
      }

      if (!ppUrl) {
        return client.sendMessage(message.from, { text: '❌ Impossible de récupérer la photo de profil.' });
      }

      // Envoi de la photo
      await client.sendMessage(message.from, {
        image: { url: ppUrl },
        caption: `📷 *Photo de profil de* @${targetId.split('@')[0]}`,
        mentions: [targetId]
      });

    } catch (err) {
      console.error('Erreur dans getpp.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de la récupération de la photo de profil.' });
    }
  }
};
