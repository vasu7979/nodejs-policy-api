
import pidusage from "pidusage";

let isChecking = false;
let isRestarting = false;

export function startCpuMonitor() {
  console.log("CPU monitor started. Checking every 5 seconds.");

  setInterval(async () => {
    if (isChecking || isRestarting) return;

    isChecking = true;

    try {
      const stats = await pidusage(process.pid);
      const cpuUsage = stats.cpu;

      console.log(`Node.js CPU Usage: ${cpuUsage.toFixed(2)}%`);

      if (cpuUsage >= process.env.CPU_USE_LIMIT) {
        isRestarting = true;

        console.error(
          `CPU usage reached ${process.env.CPU_USE_LIMIT}%. Restarting server...`
        );

        process.exit(1);
      }
    } catch (error) {
      console.error("CPU monitoring failed:", error.message);
    } finally {
      isChecking = false;
    }
  }, 5000);
}
