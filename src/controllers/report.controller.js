
import prisma from "../config/prisma.js";
import reportQueue from "../queues/report.queue.js";

export async function createReport(req, res, next) {
  try {
    const { reportIds } = req.body;

    if (
      !Array.isArray(reportIds) ||
      reportIds.length === 0 ||
      !reportIds.every(
        (id) => Number.isInteger(id) && id > 0
      )
    ) {
      return res.status(400).json({
        message: "reportIds must be an array of positive integers",
      });
    }

    const results = [];

    for (const reportId of reportIds) {
      const queueJob = await prisma.queueJob.create({
        data: {
          jobType: "GENERATE_REPORT",
          status: "PENDING",
          payload: { reportId },
        },
      });

      try {
        const job = await reportQueue.add(
          "generate-report",
          {
            reportId,
            queueJobId: queueJob.id,
          },
          {
            jobId: `report-${queueJob.id}`,
          }
        );

        await prisma.queueJob.update({
          where: { id: queueJob.id },
          data: { status: "QUEUED" },
        });

        results.push({
          reportId,
          queueJobId: queueJob.id,
          jobId: job.id,
          status: "QUEUED",
        });
      } catch (error) {
        await prisma.queueJob.update({
          where: { id: queueJob.id },
          data: {
            status: "FAILED",
            error: error.message,
          },
        });

        throw error;
      }
    }

    return res.status(202).json({
      message: "All reports queued successfully",
      totalJobs: results.length,
      jobs: results,
    });
  } catch (error) {
    next(error);
  }
}
