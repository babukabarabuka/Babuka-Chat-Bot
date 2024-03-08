const MinecraftCommand = require('../../contracts/MinecraftCommand')

class BallCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = '8ball'
		this.aliases = ['ball']
		this.description = 'Tells you the truth'
		this.ballAnswers = 'Hell no!;My sources say no.;Dumb question, but no.;Don\'t count on it.;My reply is no.;Very doubtful.;Outlook not so good.;;;;;;;;;IDK.;Probably.;Dumb question.;Reply hazy, try again.;Cannot predict now.;Ask again later.;;;;;;;;;;;Dumb question, but yes.;Most Likely.;Yes, Definitely.;Without a doubt.;As I see it, yes.;Signs point to yes.; You may rely on it.; It is decidedly so.;Yes.;'.split(';')
	}

	getRandomInt(max) {
	  return Math.floor(Math.random() * max);
	}

	onCommand(username, message) {
		this.send('/gc ' + username)
		if (username.toLowerCase().includes('hyphea')) {
			this.send('/gc What a stupid question!')
		}
		else if (username.toLowerCase().includes('babuka') && message.includes('%')) {
			this.send('/gc What a great question! I\'m not sure about the answer, but I do know that the person asking this quesion is very smart.')
		}
		else {
			this.send(`/gc ${this.ballAnswers[this.getRandomInt(this.ballAnswers.length)]}`)
		}
	}
}

module.exports = BallCommand
