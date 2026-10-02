import { EventEmitter } from "events";
import fs from "fs/promises";
import path from "path";

const auditEmitter = new EventEmitter();

const logsDir = path.join(process.cwd(), "logs");
const auditLog = path.join(logsDir, "audit.log");

async function log({
  actorId,
  action,
  entity,
  entityId,
}) {
  const record = `${new Date().toISOString()} [AUDIT] actor=${actorId} action=${action} entity=${entity} entityId=${entityId}\n`;

  await fs.mkdir(logsDir, { recursive: true });
  await fs.appendFile(auditLog, record);
}
auditEmitter.on("user.created", async ({ actorId, entityId }) => {
  await log({
    actorId,
    action: "created",
    entity: "user",
    entityId,
  });
});

auditEmitter.on("user.updated", async ({ actorId, entityId }) => {
  await log({
    actorId,
    action: "updated",
     entity: "user",
    entityId,
  });
});

auditEmitter.on("user.deleted", async ({ actorId, entityId }) => {
  await log({
    actorId,
    action: "deleted",
    entity: "user",
    entityId,
  });
});

export { auditEmitter, log };