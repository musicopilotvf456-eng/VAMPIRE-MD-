// commands/kick.js
module.exports = {
  name: 'kick',
  description: 'Supprime un membre du groupe (admin seulement)',
  async execute({ client, message, args }) {
    try {
      if (!message.isGroup) {
        return client.sendMessage(message.from, { text: '❌ Cette commande est réservée aux groupes.' });
      }

      const groupMetadata = await client.groupMetadata(message.from);
      const participants = groupMetadata.participants;

      // Vérifier si l'utilisateur est admin
      const isUserAdmin = participants.find(
        p => p.id === message.sender && (p.admin === 'admin' || p.admin === 'superadmin')
      );
      if (!isUserAdmin) {
        return client.sendMessage(message.from, { text: '🔒 Seuls les administrateurs peuvent utiliser cette commande.' });
      }

      // Vérifier si le bot est admin
      const botId = client.user?.id;
      const isBotAdmin = participants.find(
        p => p.id.includes(botId.split(':')[0]) && (p.admin === 'admin' || p.admin === 'superadmin')
      );
      if (!isBotAdmin) {
        return client.sendMessage(message.from, { text: '❌ Je dois être administrateur du groupe pour expulser quelqu\'un.' });
      }

      // Vérifier la personne ciblée
      let target;
      if (message.mentionedJid && message.mentionedJid.length > 0) {
        target = message.mentionedJid[0];
      } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      } else {
        return client.sendMessage(message.from, { text: '⚠️ Mentionnez ou fournissez le numéro de la personne à expulser.' });
      }

      // Exécuter le kick
      await client.groupParticipantsUpdate(message.from, [target], 'remove');

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';
      const admin = message.sender;

      const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________

✅ Successfully kicked
@${target.split('@')[0]}
👮 By
@${admin.split('@')[0]}
__________________________________
`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption: caption,
        mentions: [target, admin]
      });

    } catch (err) {
      console.error('Erreur dans kick.js:', err);
      return client.sendMessage(message.from, { text: '❌ Impossible de supprimer ce membre.' });
    }
  }
};
