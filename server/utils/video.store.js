const { S3Client, HeadBucketCommand, CreateBucketCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// from disk and streams it into the MinIO container, 
// into the videos bucket, under a unique key like 1699999999-lecture1.mp4. 

const BUCKET = process.env.S3_BUCKET;

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
})

async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
  }
}
if (process.env.S3_AUTO_CREATE_BUCKET === "true") {
  ensureBucket().catch(console.error);
}

async function uploadToStorage(filePath, key) {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: BUCKET,
      Key: key,
      Body: fs.createReadStream(filePath),
      ContentType: "video/mp4",
    }
  });
  await upload.done();
  return key;
};

async function deleteFromStorage(key) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

module.exports = { uploadToStorage, deleteFromStorage };
module.exports.s3 = s3; // reuse later for presigned URLs
