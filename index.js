const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')
const express = require('express')
const QRCode = require('qrcode')
const fs = require('fs')
const config = require('./config')

const app = express()
const PORT = process.env.PORT || 10000
let latestQR = null
let isConnected = false
let startTime = Date.now()
const messageStore = new Map()

app.get('/', async (req, res) => {
    const runtime = msToTime(Date.now() - startTime)
    res.send(`<body style="background:#0a0a0a;color:white;text-align:center;font-family:sans-serif;padding-top:30px">
        <h1>${config.botName}</h1>
        ${isConnected? `<h2 style="color:#00ff00">✅ Connected</h2><p>Bot is online</p>` : `<h2>Scan QR</h2>${latestQR? `<img src="${latestQR}" width="280"/>` : '<p>Generating... Please wait 5s</p>'}`}
        <p>Runtime: ${runtime}</p>
    </body>`)
})
app.listen(PORT, () => console.log(`Web: ${PORT}`))

function msToTime(ms) {
    let s = Math.floor(ms/1000), m = Math.floor(s/60), h = Math.floor(m/60), d = Math.floor(h/24)
    return `${d}d ${h%24}h ${m%60}m ${s%60}s`
}

async function startBot() {
    // DELETE OLD SESSION IF CORRUPTED - THIS FORCES NEW QR
    if(fs.existsSync(config.sessionName) &&!isConnected) {
        console.log("No creds found, waiting for QR...")
    }

    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName)
    const sock = makeWASocket({ 
        auth: state, 
        logger: pino({level:'silent'}), 
        printQRInTerminal: true // important
    })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async (u) => {
        const { connection, lastDisconnect, qr } = u
        if(qr) { 
            console.log("New QR Generated")
            latestQR = await QRCode.toDataURL(qr) 
            isConnected = false 
        }
        if(connection === 'open') { 
            latestQR = null
            isConnected = true
            console.log('✅ Connected to WhatsApp') 
        }
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnecting...', shouldReconnect)
            if(shouldReconnect) startBot()
        }
    })

    // Store messages for antidelete
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message || m.key.fromMe) return
        messageStore.set(m.key.id, m)
        setTimeout(() => messageStore.delete(m.key.id), 5 * 60 * 1000)
        if(config.autoViewStatus && m.key.remoteJid === 'status@broadcast') {
            await sock.readMessages([m.key])
        }
    })

    // Antidelete handler
    sock.ev.on('messages.update', async (updates) => {
        for(const { key, update } of updates) {
            if(update.message === null && config.antiDelete) {
                const deletedMsg = messageStore.get(key.id)
                if(!deletedMsg) return
                const from = deletedMsg.key.remoteJid
                const sender = deletedMsg.key.participant || deletedMsg.key.remoteJid
                await sock.sendMessage(from, {
                    text: `⚠️ *ANTI-DELETE*\n\n@${sender.split('@')[0]} deleted a message`,
                    mentions: [sender]
                })
                await sock.sendMessage(from, deletedMsg.message)
            }
        }
    })

    // Load all commands
    const allCommands = []
    fs.readdirSync('./commands').forEach(file => {
        allCommands.push(require(`./commands/${file}`))
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message || m.key.fromMe) return
        const from = m.key.remoteJid
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ''
        if(!body.startsWith(config.prefix)) return
        const args = body.slice(config.prefix.length).trim().split(/ +/)
        const cmd = args.shift().toLowerCase()

        if(config.autoTyping) await sock.sendPresenceUpdate('composing', from)
        if(config.autoRecording) await sock.sendPresenceUpdate('recording', from)

        for(const file of allCommands) {
            if(file.commands.includes(cmd)) {
                await file.execute(sock, m, args, { runtime: msToTime(Date.now()-startTime) })
            }
        }
        await sock.sendPresenceUpdate('available', from)
    })
}
startBot()
