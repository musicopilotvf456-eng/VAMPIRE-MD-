// commands/antispam.js
const spamTracker = new Map(); // stocke { message.from: { "texte": [timestamps] } }
let antiSpamEnabled = {};

module.exports = {
  name: 'antispam',
  description: 'Active/désactive le système anti-spam pour les groupes',
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
        return client.sendMessage(message.from, { text: 'Utilisation : *!antispam on* ou *!antispam off*' });
      }

      if (args[0] === 'on') {
        antiSpamEnabled[message.from] = true;
        client.sendMessage(message.from, { text: '✅ Anti-spam activé pour ce groupe.' });
      } else if (args[0] === 'off') {
        antiSpamEnabled[message.from] = false;
        client.sendMessage(message.from, { text: '❌ Anti-spam désactivé pour ce groupe.' });
      }
    } catch (err) {
      console.error('Erreur antispam.js:', err);
      client.sendMessage(message.from, { text: '❌ Erreur lors de l’activation/désactivation de l’anti-spam.' });
    }
  },

  // Middleware pour surveiller les messages entrants
  async onMessage({ client, message }) {
    try {
      if (!message.isGroup || !antiSpamEnabled[message.from] || !message.body) return;

      const groupStore = spamTracker.get(message.from) || {};
      const now = Date.now();

      if (!groupStore[message.body]) groupStore[message.body] = [];
      groupStore[message.body].push(now);

      // Garde uniquement les timestamps des 2 dernières minutes
      groupStore[message.body] = groupStore[message.body].filter(ts => now - ts < 120000);

      if (groupStore[message.body].length > 5) {
        // SPAM détecté : supprimer le message
        await client.sendMessage(message.from, {
          delete: message.key
        });

        // envoyer image + légende
        const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
        const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
💢 spam interdit détecté  
🥹 Stop please 
__________________________________
`;

        await client.sendMessage(message.from, {
          image: { url: botImage },
          caption
        });

        // reset le compteur pour ce message afin d'éviter la boucle infinie
        groupStore[message.body] = [];
      }

      spamTracker.set(message.from, groupStore);
    } catch (err) {
      console.error('Erreur détection antispam:', err);
    }
  }
};
