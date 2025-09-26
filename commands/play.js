// commands/play.js
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "play",
  description: "Recherche et télécharge une musique sur YouTube",
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return client.sendMessage(message.from, { text: "❌ Utilisation : !play <nom de la musique>" });
      }

      const query = args.join(" ");
      const search = await yts(query);

      if (!search.videos || search.videos.length === 0) {
        return client.sendMessage(message.from, { text: "❌ Aucun résultat trouvé sur YouTube." });
      }

      const video = search.videos[0]; // 🎯 On prend le premier résultat
      const videoInfo = await ytdl.getInfo(video.url);

      // Récupérer infos du morceau
      const name = video.title;
      const artist = video.author.name;
      const authenticated = video.author.verified ? "✅ Officiel" : "❌ Non officiel";
      const views = video.views.toLocaleString();
      const date = video.ago;

      // Télécharger l'audio
      const filePath = path.join("/tmp", `${Date.now()}.mp3`);
      const stream = ytdl(video.url, { filter: "audioonly", quality: "highestaudio" });
      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on("finish", async () => {
        await client.sendMessage(message.from, {
          text: `┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
🌐𝐕𝐄𝐑𝐒𝐈𝐎𝐍 : *1.0*
🖊️𝚃𝚈𝙿𝙴 : 𝙼𝙸𝙽𝙸-𝙱𝙾𝚃
🌹⃝━❮ 𝓹𝓻𝓸𝓶𝓾𝓽 𝓹𝓪𝓻 𝓳𝓮𝓷𝓲𝓯𝓮𝓻 𝔁𝓶
__________________________________
☞𝐧𝐚𝐦𝐞 : *${name}*
☞𝐚𝐫𝐭𝐢𝐬𝐭 : *${artist}*
☞𝐚𝐮𝐭𝐡𝐞𝐧𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐞𝐝 : *${authenticated}*
☞𝐯𝐢𝐞𝐰𝐬 : *${views}*
☞𝐝𝐚𝐭𝐞 : *${date}*`
        });

        await client.sendMessage(message.from, {
          audio: { url: filePath },
          mimetype: "audio/mpeg",
          ptt: false // ptt=true => audio en format "note vocale"
        });
      });

    } catch (err) {
      console.error("Erreur play.js:", err.message);
      client.sendMessage(message.from, { text: "❌ Erreur lors de la récupération de la musique." });
    }
  }
};
