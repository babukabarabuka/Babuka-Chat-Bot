const Configuration = require('./Configuration')
const DiscordManager = require('./discord/DiscordManager')
const MinecraftManager = require('./minecraft/MinecraftManager')
const ExpressManager = require('./express/ExpressManager')
const Logger = require('./Logger')
const os = require('os');

// Threshold for CPU usage in percentage
const CPU_THRESHOLD_PERCENTAGE = 40;

class Application {
  async register() {
    this.config = new Configuration()
    this.log = new Logger()

    this.discord = new DiscordManager(this)
    this.minecraft = new MinecraftManager(this)
    this.express = new ExpressManager(this)

    this.discord.setBridge(this.minecraft)
    this.minecraft.setBridge(this.discord)

    //hopefully this will stop the problem
    function checkCPUUsage() {
        const cpuUsage = os.loadavg()[0]; // Get the average CPU load for the last minute
        console.log(`Current CPU usage: ${cpuUsage}%`);

        if (cpuUsage >= CPU_THRESHOLD_PERCENTAGE) {
            // Trigger crash or restart logic here
            console.log("CPU usage exceeds threshold. Crashing application...");
            process.exit(1); // Exit the process with an error code to simulate a crash
        }
    }

    // Schedule CPU usage check every 1 minute
    setInterval(checkCPUUsage, 60000);
  }

  async connect() {
    this.discord.connect()
    this.minecraft.connect()
    this.express.initialize()
  }
}

module.exports = new Application()
