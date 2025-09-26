// commands/contactdev.js

module.exports = {
  name: "contactdev",
  description: "Lien de contact pour les développeurs",
  async execute({ client, message }) {
    const botImage = "./media/vampire.jpg";
    const caption = `╔════════════════▣
┊✺┌───contactdev
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://matrix.to/#/@amaodg456:matrix.org────••••────⊷
╚════════════════▣`;

    await client.sendMessage(message.from, {
      image: { url: botImage },
      caption
    });
  }
};
