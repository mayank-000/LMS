const { Queue } = require('bullmq');
const dotenv = require('dotenv');
dotenv.config();

const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
}

const uploadQueue = new Queue('videos', { connection });

module.exports = uploadQueue;