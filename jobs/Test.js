var CronJob = require('cron').CronJob;

var hourlyUpdates = new CronJob(
    "0 * * * *",
    async function(){
        console.log("Hourly cron job run at", new Date());
    }
);

// hourlyUpdates.start();