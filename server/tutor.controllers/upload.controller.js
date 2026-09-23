const { prisma } = require("../lib/prisma.js");
const { Upload } = require("../utils/video.uploader.js");

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
    const { title, description, language, content } = req.body;
    const data = {
        title: title,
        description: description,
        language: language,
        videoContent: content
    }
    const response = await Upload(data).then(response => response.json());
    if (!response || response.error) {
        return res.status(404).json({
            message: "Failed to Upload the video"
        }, response?.error)
    }
    const url = response.url;

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
            url: url,
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