// commands/promotchannel.js

module.exports = {
  name: "promotchannel",
  description: "Envoie le lien vers le channel de promotion officiel",
  async execute({ client, message }) {
    try {
      const botImage = "./media/vampire.jpg"; // ← Change le chemin si ton image est ailleurs

      const caption = `╔════════════════▣
┊✺┌─── promtchannel───⊷
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://whatsapp.com/channel/0029VbB3lzT3GJP3AsgHA71W────••••────⊷
╚════════════════▣`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error("Erreur promotchannel.js :", err.message);
      client.sendMessage(message.from, { text: "❌ Impossible d'envoyer le lien du channel de promo." });
    }
  }
};
