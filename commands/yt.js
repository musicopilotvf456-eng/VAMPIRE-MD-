// commands/yt.js
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "yt",
  description: "Recherche et télécharge une vidéo YouTube en HD",
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return client.sendMessage(message.from, { text: "❌ Utilisation : !yt <nom de la vidéo>" });
      }

      const query = args.join(" ");
      const searchResults = await yts(query);
      const video = searchResults.videos[0];

      if (!video) {
        return client.sendMessage(message.from, { text: "❌ Aucune vidéo trouvée." });
      }

      // Téléchargement en HD
      const filePath = path.join("/tmp", `${Date.now()}.mp4`);
      const stream = ytdl(video.url, { quality: "highestvideo" });

      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on("finish", async () => {
        await client.sendMessage(message.from, {
          video: { url: filePath },
          caption: `┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
👀Views : *${video.views.toLocaleString()}*
🌐Author : *${video.author.name}*
❤️Likes : *${video.likes ? video.likes : "N/A"}*`
        });

        fs.unlinkSync(filePath); // Supprime le fichier après envoi
      });

    } catch (err) {
      console.error("Erreur yt.js:", err.message);
      client.sendMessage(message.from, { text: "❌ Erreur lors du téléchargement de la vidéo." });
    }
  }
};
