// utils/downloadMedia.js

module.exports = async function downloadMedia(message) {
  const stream = await message.download();
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
};
