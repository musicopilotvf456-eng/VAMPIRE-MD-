// commands/setpp.js
const Jimp = require("jimp");

module.exports = {
  name: 'setpp',
  description: 'Télécharge la PP du user ciblé et ajoute un watermark avant de la renvoyer',
  async execute({ client, message }) {
    try {
      // Vérifier si un utilisateur a été mentionné
      if (!message.quoted) {
        return client.sendMessage(message.from, { text: '❌ Réponds au message de la personne dont tu veux modifier la PP.' });
      }

      const targetId = message.quoted.sender;

      // Récupération de la photo de profil
      let ppUrl;
      try {
        ppUrl = await client.profilePictureUrl(targetId, "image");
      } catch {
        return client.sendMessage(message.from, { text: "❌ Cette personne n’a pas de photo de profil visible." });
      }

      // Télécharger l'image
      const image = await Jimp.read(ppUrl);

      // Créer le watermark
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      const text = "〇𝐣𝐞𝐧𝐢𝐟𝐞𝐫 𝐱𝐦〇";

      image.print(
        font,
        10, // x
        image.bitmap.height - 50, // y (en bas de l'image)
        {
          text,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
        },
        image.bitmap.width,
        50
      );

      // Sauvegarde temporaire
      const outputPath = "/tmp/watermarked_pp.jpg";
      await image.quality(90).writeAsync(outputPath);

      // Envoyer l'image modifiée
      await client.sendMessage(message.from, {
        image: { url: outputPath },
        caption: `📷 PP de @${targetId.split('@')[0]} avec watermark ajouté ✅`,
        mentions: [targetId]
      });

    } catch (err) {
      console.error("Erreur dans setpp.js:", err);
      client.sendMessage(message.from, { text: "❌ Erreur lors du traitement de l'image." });
    }
  }
};
