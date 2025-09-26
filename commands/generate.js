// commands/generate.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "generate",
  description: "Génère une image à partir d'une description (FR/EN)",
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return client.sendMessage(message.from, { text: "❌ Utilisation : !generate <description de l'image>" });
      }

      const prompt = args.join(" ");

      // 🔥 Utilisation d'une API de génération d'image (DALL·E ou autre)
      // (ici exemple avec OpenAI)
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: prompt,
          size: "1024x1024",
          n: 1
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );

      const imageUrl = response.data.data[0].url;

      // Téléchargement temporaire (au cas où on veut héberger sur Catbox)
      const filePath = path.join("/tmp", `generated-${Date.now()}.png`);
      const imageData = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(imageData.data));

      // [OPTION] Upload sur catbox.moe si tu veux un lien permanent
      // const catboxRes = await axios.post("https://catbox.moe/user/api.php", {
      //   reqtype: "fileupload",
      //   fileToUpload: fs.createReadStream(filePath)
      // });

      // Envoyer sur WhatsApp
      await client.sendMessage(message.from, {
        image: { url: filePath },
        caption: `🎨 *Image générée :* "${prompt}" ✅`
      });

    } catch (err) {
      console.error("Erreur dans generate.js:", err.response?.data || err.message);
      client.sendMessage(message.from, { text: "❌ Impossible de générer l'image. Vérifie ton prompt ou ton API key." });
    }
  }
};
