// commands/joindevelgroup.js

module.exports = {
  name: "joindevelgroup",
  description: "Envoie le lien vers le groupe des développeurs",
  async execute({ client, message }) {
    try {
      const botImage = "./media/vampire.jpg"; // ← Mets ici le chemin de ton image officielle

      const caption = `╔════════════════▣
┊✺┌───devgroup
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://signal.group/#CjQKIJ0gxI0XTUgP-oFfnafLAQL7i95HyYL8OpA5pP9ws3eZEhBPpqrBufYg4PnUsxEICcXG────••••────⊷
╚════════════════▣`;

      await client.sendMessage(message.from, {
        image: { url: botImage },
        caption
      });

    } catch (err) {
      console.error("Erreur joindevelgroup.js :", err.message);
      client.sendMessage(message.from, { text: "❌ Impossible d'envoyer le lien du groupe développeurs." });
    }
  }
};
