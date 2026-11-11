const fs = require('fs/promises');
const path = require("path");
const crypto = require("crypto");
const { prisma } = require("../lib/prisma.js");
const { compressVideo } = require("../utils/video.compress.js");
const { deleteFromStorage } = require("../utils/video.store.js");
const { uploadQueue } = require("../queue/videoUpload.queue.js");

const getLikes = async (req, res) => {
    const videoId = req.videoId;
    const likes = await prisma.like.findMany({
        where: {
            videoId: videoId,
            status: "successfull"
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
            videoId: videoId,
            status: "successfull"
        },
        select: {
            student: true
        }
    });
    const commentCount = await prisma.comment.count({
        where: {
            videoId: videoId,
            status: "successfull"
        }
    });
    return res.json({ comments, commentCount });
}

const uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
    }
    const courseId = req.courseId;
    const { title, description, language } = req.body;
    
    const id = crypto.randomUUID();
    const inputPath = req.file.path;
    const outputPath = path.join("compressed", `${id}.mp4`);
    const key = `courses/${courseId}/${id}.mp4`;

    try {
        const compressedPath = await compressVideo(inputPath, outputPath);
                               
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
                url: key,
                order: nextOrder,
                language: language,
                status: "processing"
            }
        });

        await uploadQueue.add('videos', {
            compressedPath, key, videoId: store.id
        }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });

        return res.status(200).json({
            message: "Video is processing!",
            video: store.id
        });
    } catch (err) {
        console.error("uploadVideo failed:", err);
        await fs.unlink(outputPath).catch(() => {});
        return res.status(500).json({ message: "Video upload failed!" });
    } finally {
        // runs on success AND failure, so temp files never pile up
        await fs.unlink(inputPath).catch(() => {});
    }
};

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
    await prisma.video.delete({
        where: {
            id: videoId
        }
    })
    await deleteFromStorage(video.url).catch((err) => 
        console.error("Orphaned object, cleanup needed:", video.url, err)
    );
    return res.status(200).json({
        message: "Video deleted successfully"
    });;
}

module.exports = { getLikes, getComments, uploadVideo, deleteVideo };