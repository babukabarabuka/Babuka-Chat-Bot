const MinecraftCommand = require('../../contracts/MinecraftCommand')

class BallCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = '8ball'
		this.aliases = ['ball']
		this.description = 'Tells you the truth'
		//this.ballAnswers = 'Hell no!;My sources say no.;Dumb question, but no.;Don\'t count on it.;My reply is no.;Very doubtful.;Outlook not so good.$$$$$$$$$$$$$;IDK.;Probably.;Dumb question.;Reply hazy, try again.;Cannot predict now.;Ask again later.$$$$$$$$$$$$$;Dumb question, but yes.;Most Likely.;Yes, Definitely.;Without a doubt.;As I see it, yes.;Signs point to yes.; You may rely on it.; It is decidedly so.;Yes.'.replace('$', '').split(';')
		this.ballAnswers = 'Hell no!;My sources say no.;Dumb question, but no.;Don\'t count on it.;My reply is no.;Very doubtful.;Outlook not so good.$$$$$$$$$$$$$;IDK.;Probably.;Dumb question.;Reply hazy, try again.;Cannot predict now.;Ask again later.$$$$$$$$$$$$$;Dumb question, but yes.;Most Likely.;Yes, Definitely.;Without a doubt.;As I see it, yes.;Signs point to yes.;You may rely on it.;It is decidedly so.;Yes.'.replaceAll('$', '').split(';')
		this.goodAnswers = 'Most Likely.;Yes, Definitely.;Without a doubt.;As I see it, yes.;Signs point to yes.;You may rely on it.;It is decidedly so.;Yes.'.replaceAll('$', '').split(';')
		this.badAnswers = 'Hell no!;My sources say no.;No.;Don\'t count on it.;My reply is no.;Very doubtful.;Outlook not so good.'.replaceAll('$', '').split(';')
	
		this.hypheaAnswers = 'LOL, stupid.;Look at this clown asking stupid questions.;L+Ratio+Bozo+F.;What a stupid question!'.split(';')
	}

	getRandomInt(max) {
	  return Math.floor(Math.random() * max);
	}

	onCommand(username, message) {
		//this.send('/gc ' + username)
		if (username.toLowerCase().includes('hyphea')) {
			//this.send('/gc 8ball: What a stupid question!')
			this.send(`/gc 8ball: ${this.hypheaAnswers[this.getRandomInt(this.hypheaAnswers.length)]}`)
		}
		else if (username.toLowerCase().includes('babuka') && message.includes('%')) {
			if (message.includes('%a')) {
				this.send(`/gc 8ball: ${this.goodAnswers[this.getRandomInt(this.goodAnswers.length)]}`)
			}
			else if (message.includes('%b')) {
				this.send(`/gc 8ball: ${this.badAnswers[this.getRandomInt(this.badAnswers.length)]}`)
			}
			else if (message.includes('%c')){
				this.send('/gc 8ball: What a great question! I\'m not sure about the answer, but I do know that the person asking this quesion is very smart. ' + this.ballAnswers.length)
			}
		}
		else {
			this.send(`/gc 8ball: ${this.ballAnswers[this.getRandomInt(this.ballAnswers.length)]}`)
		}
	}
}

module.exports = BallCommand
