const { prisma } = require("../lib/prisma.js");

const getVideo = async (req, res) => {
    const courseId = req.courseId;
    const { videoId } = req.headers;

    if (!videoId) {
        return res.status(401).json({
            message: "Please Attach videoId in the headers!"
        })
    }
    const videoBelongs = await prisma.video.findMany({
        where: {
            courseId: courseId
        }
    })
    if (!videoBelongs) {
        return res.status(404).json({
            message: "You are not subscrided to this video or Invalid/deleted videoId!"
        })
    }

    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        },
        select: {
            _count: {
                select: {
                    likes: true,
                    comment: true
                }
            }
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

module.exports = { getVideo, likedVideo, commentVideo };