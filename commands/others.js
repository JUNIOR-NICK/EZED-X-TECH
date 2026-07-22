const config = require('../config')
module.exports = {
    commands: ['menu','ping','speed','alive','runtime','owner','quote','fact','weather','jid','profile'],
    execute: async(sock, m, args, { runtime }) => {
        const from = m.key.remoteJid
        const cmd = m.message.extendedTextMessage?.text.split(' ')[0].slice(1)
        if(cmd === 'menu') {
            const menu = `╔��═[ஜ۩𝗘𝗭𝗘𝗗 𝗫 𝗧𝗘𝗖𝗛۩ஜ]══╗
║➽ *𝗡𝗔𝗠𝗘:* ${config.botName}
║➽ *𝗥𝗨𝗡𝗧𝗜𝗠𝗘:* ${runtime}
║➽ *𝗩𝗘𝗥𝗦𝗜𝗢𝗡:* ${config.version}
║➽ *𝗢𝗪𝗡𝗘𝗥:* ${config.owner}
║➽ *𝗣𝗜𝗡𝗚:* 0ms
║➽ *𝗗𝗔𝗧𝗘:* ${new Date().toLocaleString()}
╚═══════ஜ۩۩ஜ═══════╝

╔═[ஜ۩ 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 ۩ஜ]═╗
║➽.ban.unban.promote.demote.kick.tagall.hidetag.grouplink
╚━━━━━━━━━━━۩ஜ

╔═[ஜ۩𝗦𝗘𝗡𝗧𝗜𝗡𝗘𝗟 𝗠𝗘𝗡𝗨۩ஜ]═╗
║➽.antilink.antidelete.antidel.antispam.antiflood.antitoxic
╚━━━━━━━━━━━۩ஜ

╔═[ஜ۩𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥۩ஜ]═╗
║➽.play.ytmp3.ytmp4.tiktok.instagram
╚━━━━━━━━━━━۩ஜ

╔═[ஜ۩𝗦𝗘𝗧𝗜𝗡𝗚𝗦۩ஜ ]═╗
║➽.autotyping.autorecording.autoviewstatus.restart
╚━━━━━━━━━━━۩ஜ

╔═[ஜ۩𝗨𝗧𝗜𝗟𝗜𝗧𝗬 𝗠𝗘𝗡𝗨۩ஜ]═╗
║➽.vv.vv2
╚━━━━━━━━━━━۩ஜ`
            await sock.sendMessage(from, { text: menu }, { quoted: m })
        }
        if(cmd === 'ping') await sock.sendMessage(from, { text: `Pong! ⚡` }, { quoted: m })
        if(cmd === 'runtime') await sock.sendMessage(from, { text: `Uptime: ${runtime}` }, { quoted: m })
    }
}
