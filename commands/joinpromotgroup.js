// commands/joinpromotgroup.js

module.exports = {
  name: "joinpromotgroup",
  description: "Envoie le lien vers le groupe de promotion",
  async execute({ client, message }) {
    try {
      const botImage = "./media/vampire.jpg"; // ← Mets ici le chemin de l'image officielle de ton bot

      const caption = `╔════════════════▣
┊✺┌───promotgroup
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://matrix.to/#/!VipoXHMANpjjqRXnuU:matrix.org?via=matrix.org────••••────⊷
╚════════════════▣`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error("Erreur joinpromotgroup.js :", err.message);
      client.sendMessage(message.from, { text: "❌ Impossible d'envoyer le lien du groupe promotion." });
    }
  }
};
