const MinecraftCommand = require('../../contracts/MinecraftCommand')
const apiKeyFile = require('./apiKey.json');

class SkillsCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'skills'
		this.aliases = ['skill']
		this.description = 'Tells you the given player\'s skill'
		this.apiKey = apiKeyFile.apiKey
		this.lastUsedTime = 0

		this.extraData  = {
			method: 'GET',
			headers: {
				'API-Key': this.apiKey
			}
		}
		this.skillLevelExpTable = [0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425, 47425, 67425, 97425, 147425, 222425, 322425, 522425,
		822425, 1222425, 1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425,
		9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425, 23322425, 25522425,
		27822425, 30222425, 32722425, 35322425, 38072425, 40972425, 44072425, 47472425, 51172425, 55172425,
		59472425, 64072425, 68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425, 111672425
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

						console.log("successful skills?")

						let levels = profileData.player_data.experience

						let output = `/gc ${name}\'s skills: Fishing `+ this.getSkillLevelString(levels.SKILL_FISHING, 50)
						output += '[] Combat ' + this.getSkillLevelString(levels.SKILL_COMBAT, 60)

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


	getLevelInSkill (exp, maxLevel) {
		let lvl = 0

		for (var i = 0; i <= maxLevel; i ++) {
			if (exp >= this.skillLevelExpTable[i]) {
				lvl = i
			}
			else {
				if (i === 0) {return {level:0, overflow:0}}
				let partialExp = exp - this.skillLevelExpTable[i - 1]
				let proportionalExp = partialExp/(this.skillLevelExpTable[i] - this.skillLevelExpTable[i - 1])
				proportionalExp = Math.round(proportionalExp * 100)/100
				return {
					level: lvl + proportionalExp,
					overflow: 0
				}
			}
		}
		return {
			level: maxLevel,
			overflow: exp - this.skillLevelExpTable[maxLevel]
		}
	}

	getSkillLevelString (exp, maxLevel) {
		let skill = this.getLevelInSkill(exp, maxLevel)

		let out = '' + skill.level
		if (skill.overflow > 0) {
			out += '+' + this.toShortenedNumber(skill.overflow)
		}
		return out
	}
}

module.exports = SkillsCommand
