// utils/sendImage.js

module.exports = async function sendImage(client, jid, imagePath, caption) {
  return await client.sendMessage(jid, {
    image: { url: imagePath },
    caption
  });
};
