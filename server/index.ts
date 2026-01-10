import { spawn } from "child_process";

const port = parseInt(process.env.PORT || "5000", 10);
const isDev = process.env.NODE_ENV !== "production";

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [next.js] ${message}`);
}

log(`Starting Next.js in ${isDev ? "development" : "production"} mode on port ${port}`);

const nextCommand = isDev ? "dev" : "start";
const nextProcess = spawn("npx", ["next", nextCommand, "-H", "0.0.0.0", "-p", port.toString()], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PORT: port.toString(),
  },
});

nextProcess.on("error", (err) => {
  log(`Failed to start Next.js: ${err.message}`);
  process.exit(1);
});

nextProcess.on("exit", (code) => {
  log(`Next.js exited with code ${code}`);
  process.exit(code || 0);
});

process.on("SIGTERM", () => {
  log("Received SIGTERM, shutting down...");
  nextProcess.kill("SIGTERM");
});

process.on("SIGINT", () => {
  log("Received SIGINT, shutting down...");
  nextProcess.kill("SIGINT");
});
