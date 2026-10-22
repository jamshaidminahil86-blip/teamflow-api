
import { Worker } from "bullmq";


const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
};


const worker = new Worker(
  "report-queue",
  async (job) => {
    console.log("Report job started:", job.id);
    console.log("Report data:", job.data);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Report job completed:", job.id);

    return {
      success: true,
      reportId: job.data.reportId,
    };
  },
  { connection }
);

export default worker;

worker.on("completed", (job) => {
  console.log("Worker completed job:", job.id);
});

worker.on("failed", (job, error) => {
  console.error("Worker job failed:", job?.id, error.message);
});

console.log("Report worker is running");
