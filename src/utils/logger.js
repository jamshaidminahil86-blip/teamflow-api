import fs from "fs/promises";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

const applicationLog = path.join(logsDir, "application.log");
const errorLog = path.join(logsDir, "error.log");

const writeLog = async (file, level, message) => {
  const log = `${new Date().toISOString()} [${level}] ${message}\n`;

  await fs.mkdir(logsDir, { recursive: true });
  await fs.appendFile(file, log);
};

const logger = {
  async info(message) {
    console.log(`[INFO] ${message}`);
    await writeLog(applicationLog, "INFO", message);
  },

  async warn(message) {
    console.log(`[WARN] ${message}`);
    await writeLog(applicationLog, "WARN", message);
  },

  async error(message) {
    console.error(`[ERROR] ${message}`);
    await writeLog(errorLog, "ERROR", message);
  },
};

export default logger;