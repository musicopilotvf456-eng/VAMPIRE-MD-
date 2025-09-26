// commands/antimention.js
let antiMentionEnabled = {};
let mentionStrikeCount = {}; // Compte les infractions par utilisateur

module.exports = {
  name: 'antimention',
  description: 'Supprime automatiquement les messages contenant des mentions (@) (on/off) + kick à 3 infractions',
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
        return client.sendMessage(message.from, { text: 'Utilisation : *!antimention on* ou *!antimention off*' });
      }

      if (args[0] === 'on') {
        antiMentionEnabled[message.from] = true;
        mentionStrikeCount[message.from] = {};
        client.sendMessage(message.from, { text: '✅ Anti-mention activé pour ce groupe.' });
      } else if (args[0] === 'off') {
        antiMentionEnabled[message.from] = false;
        mentionStrikeCount[message.from] = {};
        client.sendMessage(message.from, { text: '❌ Anti-mention désactivé pour ce groupe.' });
      }
    } catch (err) {
      console.error('Erreur antimention.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’activation/désactivation de l’anti-mention.' });
    }
  },

  async onMessage({ client, message }) {
    try {
      if (!message.isGroup || !antiMentionEnabled[message.from]) return;

      const text = message.body || '';
      const hasMention = text.includes('@') || (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0);

      if (hasMention) {
        // Supprime le message
        await client.sendMessage(message.from, { delete: message.key });

        if (!mentionStrikeCount[message.from]) mentionStrikeCount[message.from] = {};
        if (!mentionStrikeCount[message.from][message.sender]) mentionStrikeCount[message.from][message.sender] = 0;
        mentionStrikeCount[message.from][message.sender]++;

        const infractions = mentionStrikeCount[message.from][message.sender];

        const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
        let caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
🗣️ Mentions interdites détectées
🥹 Stop please (${infractions}/3)
__________________________________
`;

        await client.sendMessage(message.from, {
          image: { url: botImage },
          caption
        });

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
💢 @${message.sender.split('@')[0]} a été expulsé pour spam de mentions (3/3)
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
      console.error('Erreur détection antimention:', err);
    }
  }
};
