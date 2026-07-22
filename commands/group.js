module.exports = {
    commands: ['kick','tagall','grouplink'],
    execute: async(sock, m, args) => {
        const from = m.key.remoteJid
        const cmd = m.message.extendedTextMessage?.text.split(' ')[0].slice(1)
        if(cmd === 'tagall') {
            const group = await sock.groupMetadata(from)
            let text = `*Tagging ${group.participants.length} members*\n\n`
            const mentions = group.participants.map(a => a.id)
            mentions.forEach(id => text += `@${id.split('@')[0]}\n`)
            await sock.sendMessage(from, { text, mentions }, { quoted: m })
        }
        if(cmd === 'kick') {
            const users = m.message.extendedTextMessage?.contextInfo?.mentionedJid
            if(users) await sock.groupParticipantsUpdate(from, users, 'remove')
        }
    }
}
