// commands/devchannel.js

module.exports = {
  name: "devchannel",
  description: "Envoie le lien vers le channel développeur officiel",
  async execute({ client, message }) {
    try {
      const botImage = "./media/vampire.jpg"; // ← Mets ici le chemin de l'image officielle de ton bot

      const caption = `╔════════════════▣
┊✺┌───devchannel
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://youtube.com/@xmjenifer?si=7-5eIXYhsJuAyS9W────••••────⊷
╚════════════════▣`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error("Erreur devchannel.js :", err.message);
      client.sendMessage(message.from, { text: "❌ Impossible d'envoyer le lien du dev channel." });
    }
  }
};
