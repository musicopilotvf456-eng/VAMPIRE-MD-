// utils/client.js
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import logger from "./logger.js";

export default async function startClient() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: true, // Affiche le QR pour la 1ʳᵉ connexion
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      logger.error("🔴 Déconnecté. Tentative de reconnexion...");
      startClient();
    } else if (connection === "open") {
      logger.info("🟢 Bot connecté avec succès à WhatsApp !");
    }
  });

  return sock;
}
