const MinecraftCommand = require('../../contracts/MinecraftCommand')
const apiKeyFile = require('./apiKey.json');

class CataCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'cata'
		this.aliases = ['ct']
		this.description = 'Tells you the given player\'s catacombs stat'
		this.apiKey = apiKeyFile.apiKey
		this.lastUsedTime = 0

		this.extraData  = {
			method: 'GET',
			headers: {
				'API-Key': this.apiKey
			}
		}

		this.catacombsExpTable = [
			0, 50, 123, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640, 135640,
			188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640,
			4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640, 30359640, 39559640, 51559640,
			66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640, 360559640, 453559640, 
		]
	}

	onCommand(username, message) {
		if (Date.now() - this.lastUsedTime < 1000) {
			return
		}
		this.lastUsedTime = Date.now()

		let name = username
		let args = message.split(" ")

		if (args.length > 1 && message != "") {
			name = args[1]
		}

		console.log("name " + name)
		console.log("key " + this.extraData.headers['API-Key'])

		console.log("args= " + args)
		console.log('len ' + args.length)
		console.log(message)

		
		fetch("https://api.mojang.com/users/profiles/minecraft/" + name)
			.then(response => {
				if (response.ok) {
					return response.json(); // Parse the response data as JSON
				} else {
					console.log(response)
					this.send('/gc couldn\'t find a player with that IGN')
					throw new Error('mojang API request failed');
				}
			})
			.then(data => {//received minecraft uuid
				const minecraftId = data.id
				console.log("mc id: " + minecraftId)
				//profiles
				fetch('https://api.hypixel.net/v2/skyblock/profiles?uuid=' + minecraftId, this.extraData)
					.then(response => {
						if (response.ok) {
							return response.json(); // Parse the response data as JSON
						} else {
							this.send('/gc couldn\'t find a profile')
							console.log("resp fail profile")
							console.log(response.json())
							throw new Error('profiles API request failed');
						}
					})
					.then(data => {//received response from hypixel api abt profiles
						//console.log(data); // Example: Logging the data to the console
						console.log("got prof data")
						//console.log(data)
						let activeProfile = {}
						for (var i = 0; i < data.profiles.length; i ++) {
							if (data.profiles[i].selected) {
								activeProfile = data.profiles[i]
							}
						}
						//console.log(activeProfile)
						const profileId = activeProfile.profile_id

						console.log("active prof " + profileId)


						const profile = activeProfile// Retrieved from the Hypixel API with the /v2/skyblock/profiles endpoint: profiles[index]
						const profileData = profile.members[minecraftId];

						console.log("successful cata?")

						let cata = profileData.dungeons.dungeon_types.catacombs.experience
						let classes = profileData.dungeons.player_classes

						let output = `/gc ${name}\'s cata: Cata lvl `+ this.getCataLevelString(cata)
						output += ' - mage ' + this.getCataLevelString(classes.mage.experience)
						output += ' - arch ' + this.getCataLevelString(classes.archer.experience)
						output += ' - bers ' + this.getCataLevelString(classes.berserk.experience)
						output += ' - tank ' + this.getCataLevelString(classes.tank.experience)
						output += ' - heal ' + this.getCataLevelString(classes.healer.experience)
						output += ' - class average ' + ((this.getCataLevel(classes.mage.experience).level + this.getCataLevel(classes.archer.experience).level + this.getCataLevel(classes.berserk.experience).level + this.getCataLevel(classes.tank.experience).level + this.getCataLevel(classes.healer.experience).level)/5)


						this.send(output)
					

					})//received response from hypixel api abt profiles
					.catch(error => {
						console.error(error); // Example: Logging the error to the console
					});
			})//received minecraft uuid
			.catch(error => {
				console.error(error); // Example: Logging the error to the console
			});
			



		//this.send("/gc test " + name)
	}


	toShortenedNumber(bigNumber) {
		const digits = 100
		if (bigNumber >= 1000000000) {
			return ('' + Math.round(bigNumber/1000000000 * digits)/100) + 'b'
		}
		if (bigNumber >= 1000000) {
			return ('' + Math.round(bigNumber/1000000 * digits)/100) + 'm'
		}
		if (bigNumber >= 1000) {
			return ('' + Math.round(bigNumber/1000 * digits)/100) + 'k'
		}
		return bigNumber
	}


	getCataLevel (exp) {
		let lvl = 0

		for (var i = 0; i <= 50; i ++) {
			if (exp >= this.catacombsExpTable[i]) {
				lvl = i
			}
			else {
				if (i === 0) {return {level:0, overflow:0}}
				let partialExp = exp - this.catacombsExpTable[i - 1]
				let proportionalExp = partialExp/(this.catacombsExpTable[i] - this.catacombsExpTable[i - 1])
				proportionalExp = Math.round(proportionalExp * 100)/100
				return {
					level: lvl + proportionalExp,
					overflow: 0
				}
			}
		}
		return {
			level: 50,
			overflow: exp - this.catacombsExpTable[50]
		}
	}

	getCataLevelString (exp) {
		let skill = this.getCataLevel(exp)

		let out = '' + skill.level
		if (skill.overflow > 0) {
			out += '+' + this.toShortenedNumber(skill.overflow)
		}
		return out
	}
}

module.exports = CataCommand
