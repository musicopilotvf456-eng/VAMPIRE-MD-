// commands/rechearch.js
const axios = require("axios");
const { search } = require("../utils/web"); // ton module custom de recherche web
const { generateSummary } = require("../utils/ai"); // module pour IA

module.exports = {
  name: "rechearch",
  description: "Recherche sur le web une personne, un sujet ou un événement",
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return client.sendMessage(message.from, { text: "❌ Utilisation : !rechearch <sujet/nom>" });
      }

      const query = args.join(" ");

      // Recherche web 🌐
      const results = await search(query);
      if (!results || results.length === 0) {
        return client.sendMessage(message.from, { text: "❌ Aucun résultat trouvé." });
      }

      // Récupération de la première image/vidéo trouvée
      const media = results.find(r => r.image || r.video);
      const imageUrl = media?.image;
      const videoUrl = media?.video;

      // Résumé IA du sujet
      const infos = await generateSummary(query);

      // Prépare la légende
      let caption = `┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐑𝐞𝐬𝐮𝐥𝐭𝐚𝐭𝐬 𝐝𝐞 𝐥𝐚 𝐫𝐞𝐜𝐡𝐞𝐫𝐜𝐡𝐞 :
🔎 Sujet : ${query}

📝 Infos : 
${infos}

📸 Média : ${imageUrl ? "Image trouvée ✅" : "Aucune image"}
🎥 Vidéo : ${videoUrl ? "Vidéo trouvée ✅" : "Aucune vidéo"}`;

      // Envoie média + infos
      if (imageUrl) {
        await client.sendMessage(message.from, {
          image: { url: imageUrl },
          caption
        });
      } else if (videoUrl) {
        await client.sendMessage(message.from, {
          video: { url: videoUrl },
          caption
        });
      } else {
        await client.sendMessage(message.from, { text: caption });
      }

    } catch (err) {
      console.error("Erreur rechearch.js:", err.message);
      client.sendMessage(message.from, { text: "❌ Une erreur est survenue pendant la recherche." });
    }
  }
};
