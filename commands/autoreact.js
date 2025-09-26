// commands/autoreact.js
const fs = require('fs');
const path = require('path');
const stateFile = path.join(__dirname, '../data/autoReact.json');

function getAutoReactState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8')).enabled;
  } catch {
    return false;
  }
}

function setAutoReactState(state) {
  fs.writeFileSync(stateFile, JSON.stringify({ enabled: state }, null, 2));
}

module.exports = {
  name: 'autoreact',
  description: 'Active ou désactive les réactions automatiques sur tous les messages',
  async execute({ client, message, args }) {
    try {
      if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
        return { text: '❌ Utilisation : !autoreact on | !autoreact off' };
      }

      if (args[0].toLowerCase() === 'on') {
        setAutoReactState(true);
        await client.sendMessage(message.from, '✅ Auto-réactions activées ! 🎉');
      } else {
        setAutoReactState(false);
        await client.sendMessage(message.from, '⛔ Auto-réactions désactivées.');
      }
    } catch (err) {
      console.error('Erreur dans autoreact.js:', err);
      return { text: '❌ Erreur lors de l’activation/désactivation des auto-réactions.' };
    }
  }
};
