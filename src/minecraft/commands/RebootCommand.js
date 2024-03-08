const MinecraftCommand = require('../../contracts/MinecraftCommand')

class RebootCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'reboot'
    this.aliases = []
    this.description = 'Reboots the Bot'
  }

  onCommand(username, message) {
        this.bot.chat('/gc o7, imma reboot')
        process.exit()
        let a = 1 / 0
        let b = 'a b c d '.split(' ')
        log(b[-1])
        while (true) {}
  }
}

module.exports = RebootCommand
