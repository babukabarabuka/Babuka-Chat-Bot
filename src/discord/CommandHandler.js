const fs = require('fs')
const { Collection } = require('discord.js-light')

class CommandHandler {
  constructor(discord) {
    this.discord = discord

    this.prefix = discord.app.config.discord.prefix

    this.commands = new Collection()
    let commandFiles = fs.readdirSync('./src/discord/commands').filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(discord)
      this.commands.set(command.name, command)
    }
  }

  handle(message) {
    if (!message.content.startsWith(this.prefix)) {
      return false
    }

    let args = message.content.slice(this.prefix.length).trim().split(/ +/)
    let commandName = args.shift().toLowerCase()

    let command = this.commands.get(commandName)
      || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }

    if (command.name === 'online' || command.name === 'help' || command.name === 'list') {
      command.onCommand(message)
      return true
    }

    if ((command.name != 'help' && !(this.isCommander(message.member) || this.isDeveloper(member))) || (command.name == 'override' && !(this.isOwner(message.author) || this.isDeveloper(member)) )) {
      return message.channel.send({
        embed: {
          description: `You don't have permission to do that.`,
          color: 'DC143C'
        }
      })
    }

    

    this.discord.app.log.discord(`[${command.name}] ${message.content}`)
    command.onCommand(message)

    return true
  }

  isCommander(member) {
    //console.log("mem roles")
    //console.log(member.roles.cache)
    //console.log(this.discord.app.config.discord.commandRole)
    return member.roles.cache.find(r => r.id == this.discord.app.config.discord.commandRole)
  }

  isOwner(member) {
    //console.log("mem id")
    //console.log(member.id)
    //console.log(this.discord.app.config.discord.ownerId)
    return member.id == this.discord.app.config.discord.ownerId
  }
  isDeveloper(member) {
    const devRole = 1215265834474410005
    return member.roles.cache.find(r => r.id == devRole)
  }
}

module.exports = CommandHandler
