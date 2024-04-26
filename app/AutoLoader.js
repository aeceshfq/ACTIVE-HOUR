const fs = require("fs");
const path = require("path");

// Load all routes
const modelsPath = path.join(__dirname, "../models"); // Adjust this path accordingly
try {
    fs.readdirSync(modelsPath).forEach(file => {
        if (file.endsWith(".js")) {
            require(path.join(modelsPath, file));
        }
    });
} catch (error) {
    console.error("Error reading models directory:", error);
}

// Load all routes
const cronPath = path.join(__dirname, "../jobs"); // Adjust this path accordingly
try {
    fs.readdirSync(cronPath).forEach(file => {
        if (file.endsWith(".js")) {
            require(path.join(cronPath, file));
        }
    });
} catch (error) {
    console.error("Error reading cron directory:", error);
}