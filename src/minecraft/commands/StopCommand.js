const MinecraftCommand = require('../../contracts/MinecraftCommand')

class StopCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'stop'
    this.aliases = []
    this.description = 'Crashes the Server'
  }

  onCommand(username, message) {
    let a = 1 / 0
    while (true) {}
  }
}

module.exports = StopCommand
