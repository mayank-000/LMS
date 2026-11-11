const { Worker } = require("bullmq");
const fs = require('fs').promises;
const { uploadToStorage } = require("../utils/video.store.js");
const dotenv = require("dotenv");
const { prisma } = require("../lib/prisma.js");
dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const updateDB = async (compressedPath, videoId, key) => {
    try {
        await prisma.video.update({
            where: { id: videoId },
            data: {
                status: "successfull"
            }
        });
        await fs.unlink(compressedPath).catch(() => {});
        console.log(`Uploaded ${key}`);
    } catch (err) {
        console.error(`Video Uploaded but DB update failed for ${key}:`, err.message);
    }
}

const uploaderWorker = new Worker(
  "videos",
  async (job) => {
    const { compressedPath, key } = job.data;
    await uploadToStorage(compressedPath, key)
  },
  { connection },
);

uploaderWorker.on("completed", ( job ) => {
    const { compressedPath, key, videoId } = job.data;
    updateDB(compressedPath, videoId, key);    
});

uploaderWorker.on("failed", async ( job, err ) => {
  console.error(`Failed ${job?.data?.key}:`, err.message);
  // Only runs after final retries---
  if (job && job.attemptsMade >= job.opts.attempts) {
    await prisma.video.delete({
        where: { id: job.data.videoId }
    });
    await fs.unlink(job.data.compressedPath).catch(() => {});
  }
});

module.exports = uploaderWorker;