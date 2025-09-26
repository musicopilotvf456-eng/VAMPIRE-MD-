// commands/links.js

module.exports = {
  name: "links",
  description: "Affiche un menu interactif avec tous les liens importants",
  async execute({ client, message }) {
    try {
      const botImage = "./media/vampire.jpg"; // Image de ton bot
      const caption = `╔════════════════▣
┊✺┌─── 𝐕𝐀𝐌𝐏𝐈𝐑𝐄 𝐌𝐃 - 𝐋𝐈𝐍𝐊𝐒
╠✤│
╠✤│ 📌 Voici les principaux liens :
╠✤│
╠✤│ • Groupes
╠✤│ • Channels
╠✤│ • Contacts & Support
╠✤│
┊✺└────••••────⊷
╚════════════════▣`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption,
        buttons: [
          { buttonId: "devgroup", buttonText: { displayText: "💻 Dev Group" }, type: 1 },
          { buttonId: "promotgroup", buttonText: { displayText: "📢 Promot Group" }, type: 1 },
          { buttonId: "promotchannel", buttonText: { displayText: "📺 Promot Channel" }, type: 1 },
          { buttonId: "devchannel", buttonText: { displayText: "🖥 Dev Channel" }, type: 1 },
          { buttonId: "contactpromot", buttonText: { displayText: "🤝 Contact Promot" }, type: 1 },
          { buttonId: "contactdev", buttonText: { displayText: "👨‍💻 Contact Dev" }, type: 1 },
          { buttonId: "helpcenter", buttonText: { displayText: "🆘 Help Center" }, type: 1 },
        ],
        headerType: 4
      });

    } catch (err) {
      console.error("Erreur links.js :", err.message);
      client.sendMessage(message.from, { text: "❌ Impossible d'afficher le menu des liens." });
    }
  }
};
