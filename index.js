const makeWASocket = require("@whiskeysockets/baileys").default
const fs = require('fs');
const path = require('path');
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const yargs = require('yargs/yargs')
const chalk = require('chalk')
const axios = require('axios')
const _ = require('lodash')
const moment = require('moment-timezone')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, sleep, reSize } = require('./lib/myfunc') // Fixed: removed 'fetch', 'await'
const { 
    default: makeWASocket, 
    getAggregateVotesInPollMessage, 
    delay, 
    makeCacheableSignalKeyStore, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    generateForwardMessageContent, 
    prepareWAMessageMedia, 
    generateWAMessageFromContent, 
    generateMessageID, 
    downloadContentFromMessage, 
    jidDecode, 
    proto,
    jidNormalizedUser 
} = require("@whiskeysockets/baileys") // Fixed: removed duplicate and incorrect imports

const NodeCache = require("node-cache")
const readline = require("readline");
const { color } = require('./lib/color'); // Added missing import

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization - Force garbage collection if available
if (global.gc) {
    setInterval(() => {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }, 60_000) // every 1 minute
}

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1) // Panel will auto-restart
    }
}, 30_000) // check every 30 seconds

let phoneNumber = "911234567890"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });

        if (!fs.existsSync(credsPath)) {
            if (!global.SESSION_ID) {
                console.log(color(`Session id not found at SESSION_ID!\nCreds.json not found at session folder!\n\nWait to enter your number`, 'red'));
                return false;
            }

            const base64Data = global.SESSION_ID.split("dave~")[1];
            if (!base64Data) {
                console.log(color('Invalid SESSION_ID format', 'red'));
                return false;
            }

            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            console.log(color(`Session successfully saved, please wait!!`, 'green'));
            return true;
        }
        return true;
    } catch (error) {
        console.error('Error downloading session data:', error);
        return false;
    }
}

async function startconn() {
    let { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const conn = makeWASocket({
        version, // Fixed: Use the fetched version instead of hardcoded
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        mobile: useMobile,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(conn.ev)

    // Pairing code logic
    if (pairingCode && !conn.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 2547XXXXX (without + or spaces) : `)))
        }

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 255792021944 for Tanzania, 254798570132 for Kenya, etc.) without + or spaces.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await conn.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
            } catch (error) {
                console.error('Error requesting pairing code:', error)
                console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
            }
        }, 3000)
    }

    store.bind(conn.ev)

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        try {
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode
                if (reason === DisconnectReason.badSession) {
                    console.log(`Bad Session File, Please Delete Session and Scan Again`);
                    startconn()
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log("Connection closed, reconnecting....");
                    startconn();
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log("Connection Lost from Server, reconnecting...");
                    startconn();
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                    startconn()
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
                    startconn();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log("Restart Required, Restarting...");
                    startconn();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log("Connection TimedOut, Reconnecting...");
                    startconn();
                } else {
                    conn.end(`Unknown DisconnectReason: ${reason}|${connection}`)
                }
            }

            if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
                console.log(color(`\nConnecting...`, 'white'))
            }

            if (update.connection == "open" || update.receivedPendingNotifications == "true") {
                console.log(color(` `,'magenta'))
                console.log(color(`Connected to => ` + JSON.stringify(conn.user, null, 2), 'green'))
                
                await delay(1999)

                // Load plugins
                console.log('🧬 Installing Plugins')
                const pluginPath = require('path');
                fs.readdirSync("./plugins/").forEach((plugin) => {
                    if (pluginPath.extname(plugin).toLowerCase() == ".js") {
                        require("./plugins/" + plugin);
                    }
                });
                console.log('Plugins installed successful ✅')
                console.log('Bot connected to whatsapp ✅')

                const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                await conn.sendMessage(botNumber, { 
                    text: `
┏❐═⭔ *CONNECTED* ⭔═❐
┃⭔ *Bot:* VAMPIRE MD
┃⭔ *Time:* ${new Date().toLocaleString()}
┃⭔ *Status:* Online
┃⭔ *User:* ${botNumber}
┗❐═⭔════════⭔═❐`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: false,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '@newsletter',
                        newsletterName: 'VAMPIRE 𝐌ᴅ',
                        serverMessageId: -1
                    }
                }
            });
console.log(color('>Vampire Md is Connected< [ ! ]','red'))
		}
	
} catch (err) {
	  console.log('Error in Connection.update '+err)
	  startconn();
	}
})
conn.ev.on('creds.update', saveCreds)
conn.ev.on("messages.upsert",  () => { })

    //autostatus view
              conn.ev.on('messages.upsert', async chatUpdate => {
        	if (global.statusview){
        try {
            if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
            const mek = chatUpdate.messages[0];

            if (!mek.message) return;
            mek.message =
                Object.keys(mek.message)[0] === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                let emoji = [ "💙","❤️", "🌚","😍", "🙏" ];
                let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                await conn.readMessages([mek.key]);
                conn.sendMessage(
                    'status@broadcast',
                    { react: { text: sigma, key: mek.key } },
                    { statusJidList: [mek.key.participant] },
                );
            }

        } catch (err) {
            console.error(err);
        }
      }
   }
 )  
    
conn.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(conn, update);
    });
            

  conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(conn, chatUpdate);
                return;
            }
            if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            try {
                await handleMessages(conn, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err)
                if (mek.key && mek.key.remoteJid) {
                    await conn.sendMessage(mek.key.remoteJid, { 
                        text: '❌ An error occurred while processing your message.',
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: false,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '@newsletter',
                                newsletterName: 'Vampire 𝐌ᴅ',
                                serverMessageId: -1
                            }
                        }
                    }).catch(console.error);
                }
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    }) 
    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    conn.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = conn.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    conn.getName = (jid, withoutContact = false) => {
        id = conn.decodeJid(jid)
        withoutContact = conn.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === conn.decodeJid(conn.user.id) ?
            conn.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await conn.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i)}\nFN:${await conn.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
	    })
	}
	conn.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

    conn.public = true

    conn.serializeM = (m) => smsg(conn, m, store)

    conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await conn.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        })
    }
    conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await conn.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
    conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }


    conn.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return conn.sendMessage(jid, { poll: { name, values, selectableCount }}) }

conn.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
            
    conn.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    return conn
}

async function tylor() {
    if (fs.existsSync(credsPath)) {
        console.log(color("Session file found, starting bot...", 'yellow'));
 await startconn();      
} else {
         const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            console.log("Session downloaded, starting bot.");
await startconn();
    } else {
     if (!fs.existsSync(credsPath)) {
    if(!global.SESSION_ID) {
            console.log(color("Please wait for a few seconds to enter your number!", 'red'));
await startconn();
        }
    }
  }
 }
}

tylor()

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})
