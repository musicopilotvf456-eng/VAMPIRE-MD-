// utils/sendButtons.js

module.exports = async function sendButtons(client, jid, caption, buttons, imagePath) {
  return await client.sendMessage(jid, {
    image: { url: imagePath },
    caption,
    buttons,
    headerType: 4
  });
};
