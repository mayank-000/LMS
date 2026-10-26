const Minio = require("minio");
const dotenv = require("dotenv");
dotenv.config();

// minioClient.fPutObject('videos', key, compressedPath) opens the compressed file 
// from disk and streams it into the MinIO container, 
// into the videos bucket, under a unique key like 1699999999-lecture1.mp4.mp4. 
// MinIO confirms success; the function returns just that key — not a URL.

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

async function ensureBucket() {
  const exists = await minioClient.bucketExists('videos').catch(() => false);
  if (!exists) await minioClient.makeBucket('videos');
}
ensureBucket();

async function uploadToMinio(filePath, filename) {
  const bucket = "videos";
  const key = `${filename}.mp4`;

  await minioClient.fPutObject(bucket, key, filePath);
  return key;
}

module.exports = uploadToMinio;
