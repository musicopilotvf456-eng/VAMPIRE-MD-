// commands/mute.js
module.exports = {
  name: 'mute',
  description: 'Active ou désactive le mode silencieux dans le groupe (réservé aux admins)',
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
        return client.sendMessage(message.from, { text: '❌ Je dois être administrateur pour activer le mute.' });
      }

      // Vérifier l'argument passé (/mute ou /unmute)
      const action = args[0];
      if (!action || !['mute', 'unmute'].includes(action)) {
        return client.sendMessage(message.from, { text: '❌ Utilisation : /mute ou /unmute' });
      }

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      if (action === 'mute') {
        // Restreindre les messages aux admins
        await client.groupSettingUpdate(message.from, 'announcement');
        const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
🔒 Group is mute
__________________________________
__________________________________
`;
        await client.sendMessage(message.from, { image: { url: botImage }, caption });
      } else {
        // Permettre à tout le monde d'envoyer des messages
        await client.groupSettingUpdate(message.from, 'not_announcement');
        const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
🔓 Group is unmuted
__________________________________
__________________________________
`;
        await client.sendMessage(message.from, { image: { url: botImage }, caption });
      }
    } catch (err) {
      console.error('Erreur dans mute.js:', err);
      return client.sendMessage(message.from, { text: '❌ Erreur lors de l’exécution de la commande mute/unmute.' });
    }
  }
};
