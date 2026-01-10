import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";

async function buildAll() {
  console.log("Building Next.js application...");
  
  try {
    execSync("npx next build", {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
    });
    
    console.log("Creating production entry point...");
    mkdirSync("dist", { recursive: true });
    
    const entryPoint = `
const { spawn } = require("child_process");

const port = parseInt(process.env.PORT || "5000", 10);

console.log(\`Starting Next.js in production mode on port \${port}\`);

const nextProcess = spawn("npx", ["next", "start", "-H", "0.0.0.0", "-p", port.toString()], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PORT: port.toString(),
    NODE_ENV: "production",
  },
});

nextProcess.on("error", (err) => {
  console.error("Failed to start Next.js:", err.message);
  process.exit(1);
});

nextProcess.on("exit", (code) => {
  console.log("Next.js exited with code", code);
  process.exit(code || 0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  nextProcess.kill("SIGTERM");
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  nextProcess.kill("SIGINT");
});
`;
    
    writeFileSync("dist/index.cjs", entryPoint.trim());
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
