const { prisma } = require("../lib/prisma.js");

const getLikes = async (req, res) => {
    const videoId = req.videoId;
    const likes = await prisma.like.count({
        where: {
            videoId: videoId
        }
    })
    return res.json(likes);
}

const getComments = async (req, res) => {
    const videoId = req.videoId;
    const comments = await prisma.comment.findMany({
        where: {
            videoId: videoId
        }
    })
    return res.json(comments);
}

const getVideo = async (req, res) => {
    const videoId = req.videoId;
    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        }
    });
    return res.json(video);
}

const likedVideo = async (req, res) => {
    const videoId = req.videoId;
    const studentId = req.studentId;
    const like = await prisma.like.create({
        data: {
            studentId: studentId,
            videoId: videoId
        }
    });
    return res.status(200).json({ message: "Video Liked!", like })
}

const commentVideo = async (req, res) => {
    const videoId = req.videoId;
    const studentId = req.studentId;
    const { content } = req.body;
    const comment = await prisma.comment.create({
        data: {
            content: content,
            studentId: studentId,
            videoId: videoId
        }
    })
    return res.status(200).json({ message: "Comment Added!",comment })
}