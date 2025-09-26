// commands/helpcenter.js

module.exports = {
  name: "helpcenter",
  description: "Centre d'aide et support technique",
  async execute({ client, message }) {
    const botImage = "./media/vampire.jpg";
    const caption = `╔════════════════▣
┊✺┌───helpcenter
╠✤│
╠✤│
╠✤│
╠✤│
┊✺└https://matrix.to/#/%23lalalai:matrix.org────••••────⊷
╚════════════════▣`;

    await client.sendMessage(message.from, {
      image: { url: botImage },
      caption
    });
  }
};
