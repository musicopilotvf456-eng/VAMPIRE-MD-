// commands/groupinfo.js
module.exports = {
  name: 'groupinfo',
  description: 'Affiche les informations du groupe',
  async execute({ client, message }) {
    try {
      // Vérifie si la commande est utilisée dans un groupe
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande ne peut être utilisée que dans un groupe.' });
      }

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg'; // image du bot

      // Récupération des infos du groupe
      const groupMetadata = await client.groupMetadata(message.from);
      const groupName = groupMetadata.subject;
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin).map(p => `@${p.id.split('@')[0]}`);
      const memberCount = participants.length;
      const description = groupMetadata.desc ? groupMetadata.desc : 'Aucune description';
      
      // Date de création (convertie en date lisible)
      const creationDate = new Date(groupMetadata.creation * 1000);
      const jour = creationDate.getDate();
      const mois = creationDate.getMonth() + 1;
      const annee = creationDate.getFullYear();

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
🌹nom du groupe : ${groupName}
🌹nombre : ${memberCount}
🌹admins : ${admins.join(', ')}
🌹date : ${jour}/${mois}/${annee}
🌹description : ${description}
__________________________________
`;

      // Envoi de l'image avec les infos
      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: admins
      });

    } catch (err) {
      console.error('Erreur dans groupinfo.js:', err);
      return client.sendMessage(message.from, { text: '❌ Impossible de récupérer les informations du groupe.' });
    }
  }
};
