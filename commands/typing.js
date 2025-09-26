// typing.js
const fs = require('fs');
const path = require('path');
const stateFile = path.join(__dirname, '../data/typingState.json');

// Fonction pour lire l'état actuel
function getTypingState() {
  try {
    const data = fs.readFileSync(stateFile, 'utf8');
    return JSON.parse(data).enabled;
  } catch {
    return false;
  }
}

// Fonction pour écrire l'état
function setTypingState(state) {
  fs.writeFileSync(stateFile, JSON.stringify({ enabled: state }, null, 2));
}

module.exports = {
  name: 'typing',
  description: 'Active ou désactive la simulation de frappe automatique',
  async execute({ client, message, args }) {
    try {
      if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
        return { text: '❌ Utilisation : !typing on | !typing off' };
      }

      if (args[0].toLowerCase() === 'on') {
        setTypingState(true);
        await client.sendMessage(message.from, '✅ Mode auto-typing activé ! ✍️');
      } else {
        setTypingState(false);
        await client.sendMessage(message.from, '⛔ Mode auto-typing désactivé.');
      }
    } catch (err) {
      console.error('Erreur dans typing.js:', err);
      return { text: '❌ Erreur lors du changement du mode typing.' };
    }
  }
};
