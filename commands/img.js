// commands/img.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

module.exports = {
  name: "img",
  description: "Recherche et télécharge une image en fonction d'un mot-clé",
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return client.sendMessage(message.from, { text: "❌ Utilisation : !img <mot-clé>" });
      }

      const query = args.join(" ");
      const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;

      // ✅ Utilisation de l'API non-officielle DuckDuckGo
      const response = await axios.get(
        `https://duckduckgo.com/i.js?o=json&q=${encodeURIComponent(query)}`
      );

      if (!response.data.results || response.data.results.length === 0) {
        return client.sendMessage(message.from, { text: "❌ Aucune image trouvée." });
      }

      // Prend la première image trouvée
      const imageResult = response.data.results[0].image;
      const filePath = path.join("/tmp", `${Date.now()}.jpg`);

      const imgBuffer = await axios.get(imageResult, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, imgBuffer.data);

      // Envoi de l'image
      await client.sendMessage(message.from, {
        image: { url: filePath },
        caption: `📸 Résultat pour : *${query}*`
      });

    } catch (err) {
      console.error("Erreur img.js:", err.message);
      client.sendMessage(message.from, { text: "❌ Erreur lors de la recherche de l'image." });
    }
  }
};
