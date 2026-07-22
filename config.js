const fs = require('fs')
let settings = {}
if(fs.existsSync('./settings.json')) settings = JSON.parse(fs.readFileSync('./settings.json'))

module.exports = {
    prefix: '.',
    botName: '⚡𝐄𝐙𝐄𝐃 𝐗 𝐓𝐄𝐂𝐇',
    version: 'v1.0.0',
    owner: 'EZED X TECH',
    sessionName: 'session',
    ownerNumber: '254769532338',
    autoTyping: settings.autoTyping || false,
    autoRecording: settings.autoRecording || false,
    autoViewStatus: settings.autoViewStatus || false,
    antiDelete: settings.antiDelete || false
}
