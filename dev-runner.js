const { spawn } = require("node:child_process");
const path = require("node:path");
const readline = require("node:readline");

const rootDir = __dirname;
const systemRoot = process.env.SystemRoot || "C:\\Windows";
const system32 = path.join(systemRoot, "System32");
const powershell = path.join(system32, "WindowsPowerShell", "v1.0", "powershell.exe");
const baseEnv = {
  ...process.env,
  ComSpec: path.join(system32, "cmd.exe"),
  PATH: `${system32};${process.env.PATH || ""}`,
};

const processes = [
  {
    name: "BACKEND",
    color: "\x1b[32m",
    cwd: path.join(rootDir, "code", "backend"),
    command: "mvn spring-boot:run",
  },
  {
    name: "FRONTEND",
    color: "\x1b[36m",
    cwd: path.join(rootDir, "code", "frontend"),
    command: "npm.cmd run dev",
  },
];

let shuttingDown = false;
const children = [];

function prefixOutput(stream, name, color, isError = false) {
  const rl = readline.createInterface({ input: stream });
  rl.on("line", (line) => {
    const output = `${color}[${name}]\x1b[0m ${line}`;
    (isError ? process.stderr : process.stdout).write(`${output}\n`);
  });
}

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exitCode = exitCode;
}

for (const proc of processes) {
  const child = spawn(
    powershell,
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", proc.command],
    {
      cwd: proc.cwd,
      env: baseEnv,
      stdio: ["inherit", "pipe", "pipe"],
    }
  );

  children.push(child);
  prefixOutput(child.stdout, proc.name, proc.color);
  prefixOutput(child.stderr, proc.name, proc.color, true);

  child.on("error", (error) => {
    process.stderr.write(`${proc.color}[${proc.name}]\x1b[0m ${error.message}\n`);
    stopAll(1);
  });

  child.on("exit", (code) => {
    if (!shuttingDown && code !== 0) {
      process.stderr.write(`${proc.color}[${proc.name}]\x1b[0m exited with code ${code}\n`);
      stopAll(code || 1);
    }
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
