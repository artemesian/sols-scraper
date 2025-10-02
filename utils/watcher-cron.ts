import cron from "node-cron";
import saveData from "./watcher";

// Schedule the task to run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
    console.log("Running the scheduled task to save data...");
    await saveData();
    console.log("Data saved successfully.");
});

export default cron;