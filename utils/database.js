// utils/database.js
import fs from "fs";

const DB_PATH = "./database.json";

// Charger les données au démarrage
let database = {};
if (fs.existsSync(DB_PATH)) {
  database = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
} else {
  database = { users: {}, groups: {} };
  fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2));
}

// Sauvegarde automatique
export function saveDatabase() {
  fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2));
}

// Gestion des utilisateurs
export function getUser(id) {
  if (!database.users[id]) {
    database.users[id] = { warns: 0, xp: 0, level: 1 };
    saveDatabase();
  }
  return database.users[id];
}

export function updateUser(id, data) {
  database.users[id] = { ...getUser(id), ...data };
  saveDatabase();
}

// Gestion des groupes
export function getGroup(id) {
  if (!database.groups[id]) {
    database.groups[id] = { settings: { antiSpam: false, welcome: true } };
    saveDatabase();
  }
  return database.groups[id];
}

export function updateGroup(id, data) {
  database.groups[id] = { ...getGroup(id), ...data };
  saveDatabase();
}

export default { getUser, updateUser, getGroup, updateGroup, saveDatabase };
