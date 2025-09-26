// commands/kickall.js
module.exports = {
  name: 'kickall',
  description: 'Supprime tous les membres du groupe sauf les administrateurs (réservé aux admins)',
  async execute({ client, message }) {
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
        return client.sendMessage(message.from, { text: '❌ Je dois être administrateur pour exécuter cette commande.' });
      }

      const botImage = 'https://files.catbox.moe/jvuqi0.jpg';

      // Filtrer les membres non-admins
      const membersToKick = participants.filter(p => !p.admin);

      if (membersToKick.length === 0) {
        return client.sendMessage(message.from, { text: '✅ Aucun membre à exclure. Tous les membres restants sont admins.' });
      }

      // Expulser chaque membre un par un
      for (const member of membersToKick) {
        try {
          await client.groupParticipantsUpdate(message.from, [member.id], 'remove');

          const caption = `
┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
👀 Adios @${member.id.split('@')[0]}
__________________________________
__________________________________
`;

          await client.sendMessage(message.from, {
            image: { url: botImage },
            caption,
            mentions: [member.id]
          });

          await new Promise(resolve => setTimeout(resolve, 2000)); // pause 2s pour éviter le flood
        } catch (errKick) {
          console.error(`Erreur lors de l'exclusion de ${member.id}:`, errKick);
        }
      }

      await client.sendMessage(message.from, { text: '✅ Kickall terminé. Tous les non-admins ont été exclus.' });
    } catch (err) {
      console.error('Erreur dans kickall.js:', err);
      return client.sendMessage(message.from, { text: '❌ Erreur lors de l’exécution de la commande kickall.' });
    }
  }
};
