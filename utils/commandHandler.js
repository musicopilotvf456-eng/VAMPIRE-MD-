// utils/commandHandler.js

const fs = require("fs");
const path = require("path");

const commands = new Map();

// Charger toutes les commandes dans la Map
fs.readdirSync(path.join(__dirname, "../commands"))
  .filter(file => file.endsWith(".js"))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
  });

module.exports = async function handleCommand(client, message) {
  try {
    const prefix = "!";
    if (!message.body.startsWith(prefix)) return;

    const args = message.body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    await command.execute({
      client,
      message,
      args
    });

  } catch (err) {
    console.error("Erreur CommandHandler :", err.message);
    client.sendMessage(message.from, { text: "❌ Une erreur est survenue." });
  }
};
