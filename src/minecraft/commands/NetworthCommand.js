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
		if (Date.now() - lastUsedTime < 1000) {
			return
		}
		lastUsedTime = Date.now()
		
		this.send("/gc test " + apiKey)
	}
}

module.exports = NetworthCommand
