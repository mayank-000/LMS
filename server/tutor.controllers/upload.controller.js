const fs = require('fs/promises');
const { prisma } = require("../lib/prisma.js");
const { minioClient } = require("minio")
const { compressVideo } = require("../utils/video.compress.js");
const { uploadToMinio } = require("../utils/video.store.js");

const getLikes = async (req, res) => {
    const videoId = req.videoId;
    const likes = await prisma.like.findMany({
        where: {
            videoId: videoId
        },
        select: {
            student: true
        }
    });
    const likeCount = await prisma.like.count({
        where: {
            videoId: videoId
        }
    });
    return res.json({ likes, likeCount });
}

const getComments = async (req, res) => {
    const videoId = req.videoId;
    const comments = await prisma.comment.findMany({
        where: {
            videoId: videoId
        },
        select: {
            student: true
        }
    });
    const commentCount = await prisma.comment.count({
        where: {
            videoId: videoId
        }
    });
    return res.json({ comments, commentCount });
}

const uploadVideo = async (req, res) => {
    const courseId = req.courseId;
    const { title, description, language } = req.body;
    
    const inputPath = req.file.path;
    const outputPath = `compressed/${Date.now()}-${req.file.filename}.mp4`;

    const compressedPath = await compressVideo(inputPath, outputPath);
    
    const videoKey = await uploadToMinio(compressedPath, req.file.filename);
    if (!videoKey) {
        return res.status(400).json({
            message: "Video upload failed!"
        })
    }
    await fs.unlink(inputPath).catch(() => {});
    await fs.unlink(compressedPath).catch(() => {});

    const lastVideo = await prisma.video.findFirst({
        where: {
            courseId: courseId
        },
        orderBy: {
            order: "desc"
        }
    });
    const nextOrder = lastVideo ? lastVideo.order + 1 : 1;

    const store = await prisma.video.create({
        data: {
            title: title,
            description: description,
            courseId: courseId,
            url: videoKey,
            order: nextOrder,
            language: language,
        }
    })
    return res.status(200).json({
        message: "Video Uploaded successfully!",
        video: store.id
    })
}

const deleteVideo = async (req, res) => {
    const videoId = req.videoId;

    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        },
        select: {
            url: true
        }
    });
    await minioClient.removeObject('videos', video.url);
    
    await prisma.video.delete({
        where: {
            id: videoId
        }
    })
    return res.status(200).json({
        message: "Video deleted successfully"
    });;
}

module.exports = { getLikes, getComments, uploadVideo, deleteVideo };