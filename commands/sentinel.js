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
    commands: ['antidelete','antidel','antilink','antispam','antiflood','antitoxic'],
    execute: async(sock, m, args) => {
        const from = m.key.remoteJid
        const cmd = m.message.extendedTextMessage?.text.split(' ')[0].slice(1)
        const option = args[0]
        if(cmd === 'antidelete' || cmd === 'antidel') {
            config.antiDelete = option === 'on'
            saveSettings()
            await sock.sendMessage(from, { text: `AntiDelete: ${config.antiDelete? 'ON ✅' : 'OFF ❌'}` }, { quoted: m })
        }
    }
}
