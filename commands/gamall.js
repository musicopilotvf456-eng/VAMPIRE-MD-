// commands/gamall.js
module.exports = {
  name: 'gamall',
  description: 'Invite tout le groupe à jouer à un jeu en taggant tout le monde',
  async execute({ client, message }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande fonctionne uniquement dans un groupe.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const participants = groupMetadata.participants;

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
      let tags = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
❤️‍🔥 Salut 🗣️ tout le monde je propose qu'on joue à un jeu 🎮
Svp 🥹
__________________________________

${tags}
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption,
        mentions: participants.map(p => p.id)
      });

    } catch (err) {
      console.error('Erreur gamall.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’envoi de l’invitation de jeu.' });
    }
  }
};
