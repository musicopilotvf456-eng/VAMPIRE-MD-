// commands/antimedia.js
let antiMediaEnabled = {};
let mediaStrikeCount = {}; // Compte les infractions par utilisateur et par groupe

module.exports = {
  name: 'antimedia',
  description: 'Supprime automatiquement les médias envoyés dans le groupe (on/off) + auto-kick après 3 infractions',
  async execute({ client, message, args }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande fonctionne uniquement dans un groupe.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const participants = groupMetadata.participants;

      const isUserAdmin = participants.find(
        p => p.id === message.sender && (p.admin === 'admin' || p.admin === 'superadmin')
      );
      if (!isUserAdmin) {
        return client.sendMessage(message.from, { text: '🔒 Seuls les administrateurs peuvent utiliser cette commande.' });
      }

      if (!args[0]) {
        return client.sendMessage(message.from, { text: 'Utilisation : *!antimedia on* ou *!antimedia off*' });
      }

      if (args[0] === 'on') {
        antiMediaEnabled[message.from] = true;
        mediaStrikeCount[message.from] = {}; // reset le compteur
        client.sendMessage(message.from, { text: '✅ Anti-média activé pour ce groupe.' });
      } else if (args[0] === 'off') {
        antiMediaEnabled[message.from] = false;
        mediaStrikeCount[message.from] = {};
        client.sendMessage(message.from, { text: '❌ Anti-média désactivé pour ce groupe.' });
      }
    } catch (err) {
      console.error('Erreur antimedia.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’activation/désactivation de l’anti-média.' });
    }
  },

  async onMessage({ client, message }) {
    try {
      if (!message.isGroup || !antiMediaEnabled[message.from]) return;

      // Détecter si le message contient un média
      const isMedia =
        message.message?.imageMessage ||
        message.message?.videoMessage ||
        message.message?.audioMessage ||
        message.message?.documentMessage ||
        message.message?.stickerMessage;

      if (isMedia) {
        // Supprimer le message immédiatement
        await client.sendMessage(message.from, { delete: message.key });

        // Incrémenter le compteur d'infractions
        if (!mediaStrikeCount[message.from]) mediaStrikeCount[message.from] = {};
        if (!mediaStrikeCount[message.from][message.sender]) mediaStrikeCount[message.from][message.sender] = 0;
        mediaStrikeCount[message.from][message.sender]++;

        const infractions = mediaStrikeCount[message.from][message.sender];

        const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
        let caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
👀 Médias interdits détectés  
🥹 Stop please (${infractions}/3)
__________________________________
`;

        await client.sendMessage(message.from, {
          image: { url: botImage },
          caption
        });

        // Si plus de 3 infractions → kick automatique
        if (infractions >= 3) {
          await client.groupParticipantsUpdate(message.from, [message.sender], 'remove');

          const kickCaption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
💢 @${message.sender.split('@')[0]} a été expulsé pour envoi de médias interdits (3/3)
__________________________________
`;
          await client.sendMessage(message.from, {
            image: { url: botImage },
            caption: kickCaption,
            mentions: [message.sender]
          });
        }
      }
    } catch (err) {
      console.error('Erreur détection antimedia:', err);
    }
  }
};
