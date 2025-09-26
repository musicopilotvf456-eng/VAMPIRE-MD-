// commands/calculate.js
const math = require("mathjs");

module.exports = {
  name: "calculate",
  description: "Résout une équation mathématique",
  async execute({ client, message, args }) {
    try {
      if (!args.length) {
        return client.sendMessage(message.from, { text: "❌ Utilisation : !calculate <expression>" });
      }

      const expression = args.join(" ");
      let result;

      try {
        result = math.evaluate(expression);
      } catch (err) {
        return client.sendMessage(message.from, { text: "⚠️ Erreur dans l'expression mathématique." });
      }

      await client.sendMessage(message.from, {
        text: `┌───────────────────
│ 🅥︎🅐︎🅜︎🅟︎🅘︎🅡︎🅔︎  Ⓜ︎Ⓓ︎
└───────────────────
📊 *Calcul demandé :* ${expression}
✅ *Résultat :* ${result}`
      });

    } catch (err) {
      console.error("Erreur calculate.js:", err.message);
      client.sendMessage(message.from, { text: "❌ Une erreur est survenue." });
    }
  }
};
