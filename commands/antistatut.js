// commands/antistatut.js
let antiStatutEnabled = {};
let statutStrikeCount = {}; // Compte les infractions par utilisateur et par groupe

module.exports = {
  name: 'antistatut',
  description: 'Supprime automatiquement les mentions de statuts dans le groupe (on/off) + auto-kick après 3 infractions',
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
        return client.sendMessage(message.from, { text: 'Utilisation : *!antistatut on* ou *!antistatut off*' });
      }

      if (args[0] === 'on') {
        antiStatutEnabled[message.from] = true;
        statutStrikeCount[message.from] = {}; // reset le compteur
        client.sendMessage(message.from, { text: '✅ Anti-statut activé pour ce groupe.' });
      } else if (args[0] === 'off') {
        antiStatutEnabled[message.from] = false;
        statutStrikeCount[message.from] = {};
        client.sendMessage(message.from, { text: '❌ Anti-statut désactivé pour ce groupe.' });
      }
    } catch (err) {
      console.error('Erreur antistatut.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’activation/désactivation de l’anti-statut.' });
    }
  },

  async onMessage({ client, message }) {
    try {
      if (!message.isGroup || !antiStatutEnabled[message.from]) return;

      if (message.mentionedJid?.some(jid => jid.includes('status@broadcast'))) {
        // Supprimer le message immédiatement
        await client.sendMessage(message.from, { delete: message.key });

        // Incrémenter le compteur d'infractions pour cet utilisateur
        if (!statutStrikeCount[message.from]) statutStrikeCount[message.from] = {};
        if (!statutStrikeCount[message.from][message.sender]) statutStrikeCount[message.from][message.sender] = 0;
        statutStrikeCount[message.from][message.sender]++;

        const infractions = statutStrikeCount[message.from][message.sender];

        const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
        let caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
🤭 Statuts interdits détectés  
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
💢 @${message.sender.split('@')[0]} a été expulsé pour spam de statuts (3/3)
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
      console.error('Erreur détection antistatut:', err);
    }
  }
};
