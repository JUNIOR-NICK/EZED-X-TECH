const fs = require('fs')
const config = require('../config')
function saveSettings() {
    fs.writeFileSync('./settings.json', JSON.stringify({
        autoTyping:config.autoTyping,
        autoRecording:config.autoRecording,
        autoViewStatus:config.autoViewStatus,
        antiDelete:config.antiDelete
    }))
}
module.exports = {
    commands: ['autotyping','autorecording','autoviewstatus','restart'],
    execute: async(sock, m, args) => {
        const from = m.key.remoteJid
        const cmd = m.message.extendedTextMessage?.text.split(' ')[0].slice(1)
        const option = args[0]
        if(['autotyping','autorecording','autoviewstatus'].includes(cmd)) {
            config[cmd] = option === 'on'
            saveSettings()
            await sock.sendMessage(from, { text: `${cmd}: ${option.toUpperCase()}` }, { quoted: m })
        }
        if(cmd === 'restart') process.exit(1)
    }
}
