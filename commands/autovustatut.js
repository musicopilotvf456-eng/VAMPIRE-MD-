// autovustatut.js
const fs = require('fs');
const path = require('path');
const stateFile = path.join(__dirname, '../data/autoViewStatus.json');

function getAutoViewState() {
  try {
    const data = fs.readFileSync(stateFile, 'utf8');
    return JSON.parse(data).enabled;
  } catch {
    return false;
  }
}

function setAutoViewState(state) {
  fs.writeFileSync(stateFile, JSON.stringify({ enabled: state }, null, 2));
}

module.exports = {
  name: 'autovustatut',
  description: 'Active ou désactive la vue automatique des statuts WhatsApp',
  async execute({ client, message, args }) {
    try {
      if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
        return { text: '❌ Utilisation : !autovustatut on | !autovustatut off' };
      }

      if (args[0].toLowerCase() === 'on') {
        setAutoViewState(true);
        await client.sendMessage(message.from, '✅ Auto-visionnage des statuts activé ! 👀');
      } else {
        setAutoViewState(false);
        await client.sendMessage(message.from, '⛔ Auto-visionnage des statuts désactivé.');
      }
    } catch (err) {
      console.error('Erreur dans autovustatut.js:', err);
      return { text: '❌ Erreur lors de l’activation/désactivation de l’auto-vue des statuts.' };
    }
  }
};
