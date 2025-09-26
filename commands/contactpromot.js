// commands/contactpromot.js

module.exports = {
  name: "contactpromot",
  description: "Lien de contact pour la promotion",
  async execute({ client, message }) {
    const botImage = "./media/vampire.jpg";
    const caption = `╔════════════════▣
┊✺┌───contactpromot
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://matrix.to/#/@mikle226:matrix.org────••••────⊷
╚════════════════▣`;

    await client.sendMessage(message.from, {
      image: { url: botImage },
      caption
    });
  }
};
