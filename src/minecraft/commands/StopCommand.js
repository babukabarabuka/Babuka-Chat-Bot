const MinecraftCommand = require('../../contracts/MinecraftCommand')

class StopCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'stop'
		this.aliases = []
		this.description = 'Stops the Bot'
	}

	onCommand(username, message) {
		this.send('/gc o7, imma stop')
		while (true) {}
	}
}

module.exports = StopCommand
