const MinecraftCommand = require('../../contracts/MinecraftCommand')

class StopCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'stop'
		this.aliases = []
		this.description = 'Stops the Bot'
	}

	onCommand(username, message) {
		if (username.toLowerCase().includes('hyphea') || username.toLowerCase().includes('babuka')) {
			this.send('/gc o7, imma stop')
			while (true) {}
		}
		else {
			this.send('/gc you don\'t have permission')
		}
	}
}

module.exports = StopCommand
