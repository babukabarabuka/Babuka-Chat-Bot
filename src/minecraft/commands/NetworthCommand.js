const MinecraftCommand = require('../../contracts/MinecraftCommand')
const apiKeyFile = require('./apiKey.json');
const { getNetworth } = require('skyhelper-networth');

class NetworthCommand extends MinecraftCommand {
	constructor(minecraft) {
		super(minecraft)

		this.name = 'networth'
		this.aliases = ['nw']
		this.description = 'Tells you the given player\'s networth'
		this.apiKey = apiKeyFile.apiKey
		this.lastUsedTime = 0

		this.extraData  = {
		method: 'GET',
		headers: {
			'API-Key': this.apiKey
		}
	}
	}

	onCommand(username, message) {
		if (Date.now() - this.lastUsedTime < 1000) {
			return
		}
		this.lastUsedTime = Date.now()

		let name = username
		let args = message.split(" ")

		if (args.length > 0 && message != "") {
			//name = args[1]
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

						//museum
						fetch('https://api.hypixel.net/v2/skyblock/museum?profile=' + profileId, this.extraData)
							.then(response => {
								if (response.ok) {
									return response.json(); // Parse the response data as JSON
								} else {
									console.log(response.json())
									throw new Error('museum API request failed' )
								}
							})
							.then(data => {//received response from hypixel api abt museum
								console.log("museum:")
								//console.log(data); // Example: Logging the data to the console

								const activeMuseum = data.members[minecraftId]

								const profile = activeProfile// Retrieved from the Hypixel API with the /v2/skyblock/profiles endpoint: profiles[index]
								const museumData = activeMuseum// Retrieved from the Hypixel API with the /v2/skyblock/museum endpoint: museum.members[uuid]

								const profileData = profile.members[minecraftId];
								const bankBalance = profile.banking?.balance;

								const networth = getNetworth(profileData, bankBalance, { v2Endpoint: true, museumData });
								networth.then(networth => {
									//console.log(networth.networth)
									//console.log(activeProfile.cute_name)
									this.send(`/gc ${name}'s networth on ${activeProfile.cute_name} is ${this.toShortenedNumber(networth.networth)}`)
									
									console.log("successful nw get")
								})


							})//received response from hypixel api abt museum
							.catch(error => {
								console.error(error); // Example: Logging the error to the console
							});

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
}

module.exports = NetworthCommand
