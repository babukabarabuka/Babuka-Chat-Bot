const MinecraftCommand = require('../../contracts/MinecraftCommand')
const apiKeyFile = require('./apiKey.json');

class NetworthCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'networth'
		this.aliases = ['nw']
		this.description = 'Tells you the given player\s networth'
		this.apiKey = apiKeyFile.apiKey
		this.lastUsedTime = 0
	}

	onCommand(username, message) {
		if (Date.now() - this.lastUsedTime < 1000) {
			return
		}
		this.lastUsedTime = Date.now()

		this.send("/gc test " + this.apiKey)
	}
}

module.exports = NetworthCommand
