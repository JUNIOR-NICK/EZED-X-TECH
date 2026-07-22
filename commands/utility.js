module.exports = {
    commands: ['vv','vv2'],
    execute: async(sock, m, args) => {
        const from = m.key.remoteJid
        const cmd = m.message.extendedTextMessage?.text.split(' ')[0].slice(1)
        const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!quoted) return sock.sendMessage(from, { text: 'Reply to a view once message' }, { quoted: m })
        let type = Object.keys(quoted)[0]
        let media = quoted[type]
        if(cmd === 'vv2') media.viewOnce = false
        await sock.sendMessage(from, { [type]: media }, { quoted: m })
    }
}
