// index.js
import fs from "fs";
import path from "path";
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import pino from "pino";
import logger from "./utils/logger.js";
import { fileURLToPath } from "url";

// Résolution des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Préfixe (modifiable via variable d'env ou défaut "!")
const PREFIX = process.env.PREFIX || "!";

// -------------------------
// CHARGEMENT DES COMMANDES
// -------------------------
const commands = new Map();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if (command.default && command.default.name) {
    commands.set(command.default.name, command.default);
    logger.info(`✅ Commande chargée : ${command.default.name}`);
  }
}

// -------------------------
// CLIENT WHATSAPP
// -------------------------
async function startClient() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: "silent" }), // réduit le spam de logs
    printQRInTerminal: true, // QR en console au premier démarrage
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      logger.error("❌ Déconnecté, reconnexion en cours...");
      startClient();
    } else if (connection === "open") {
      logger.info("🟢 Bot connecté avec succès à WhatsApp !");
    }
  });

  // -------------------------
  // ÉCOUTE DES MESSAGES
  // -------------------------
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const sender = msg.key.participant || msg.key.remoteJid;
    const fromGroup = msg.key.remoteJid.endsWith("@g.us");

    let textMessage;
    if (msg.message.conversation) textMessage = msg.message.conversation;
    else if (msg.message.extendedTextMessage)
      textMessage = msg.message.extendedTextMessage.text;
    else return;

    if (!textMessage.startsWith(PREFIX)) return;

    const args = textMessage.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    try {
      await commands.get(commandName).execute(sock, msg, args, { fromGroup, sender });
      logger.info(`⚡ Commande exécutée : ${commandName} par ${sender}`);
    } catch (err) {
      logger.error(`❌ Erreur commande ${commandName} :`, err);
      await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Erreur lors de l'exécution de la commande." });
    }
  });

  return sock;
}

// Lancement du bot
startClient();
