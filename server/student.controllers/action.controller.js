const { prisma } = require("../lib/prisma.js");
const { minioClient } = require("minio")


const getVideo = async (req, res) => {
    const courseId = req.courseId;
    const videoId = req.videoId;

    const video = await prisma.video.findFirst({
        where: {
            id: videoId,
            courseId: courseId
        },
        select: {
            url: true,
            title: true,
            description: true,
            _count: {
                select: {
                    likes: true,
                    comment: true
                }
            },
            belongsTo: {
                select: {
                    tutor: {
                        select: {
                            username: true
                        }
                    }
                }
            }         
        }
    });
    if (!video) {
        return res.status(400).json({ message: "Video does not belongs to this course! "});
    }

    const signedUrl = await minioClient.presignedGetObject('videos', video.url, 3600);

    return res.json({
        url: signedUrl,
        title: video.title,
        description: video.description,
        likes: video._count.likes,
        comments: video._count.comment,
        tutorUsername: video.belongsTo.tutor.username
    });
}

const likedVideo = async (req, res) => {
    const videoId = req.videoId;
    const studentId = req.studentId;
    try {
        const like = await prisma.like.create({
            data: {
                studentId: studentId,
                videoId: videoId
            }
        });
        return res.status(200).json({ message: "Video Liked!", like });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "You already liked this video!" });
        }
        throw error;
    }
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