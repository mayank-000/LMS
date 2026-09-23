const { prisma } = require("../lib/prisma.js");

const getCourseProgress = async (req, res) => {
    const studentId = req.studentId;
    const courseId = req.courseId;
    const progress = await prisma.progress.findMany({
        where: {
            courseId: courseId,
            studentId: studentId
        }
    })
    return res.json(progress);
}

const getVideoProgress = async (req, res) => {
    const studentId = req.studentId;
    const videoId = req.videoId;
    const progress = await prisma.progress.findMany({
        where: {
            // Prisma creates studentId_videoId because of: @@unique([studentId, videoId])
            studentId_videoId: {
                studentId,
                videoId
            }
        }
    })
    return res.json(progress);
}

const updateVideoProgress = async (req, res) => {
    const studentId = req.studentId;
    const videoId = req.videoId; // courseProgress
    const courseId = req.courseId;

    const progress = await prisma.progress.upsert({
        where: {
            studentId_videoId: {
                studentId,
                videoId
            }
        },
        update: {
            completed: true,
            completedAt: Date.now()
        },
        create: {
            studentId,
            videoId,
            courseId,
            completed: true,
            completedAt: new Date()
        }
    })
    return res.json({message: "Video history Updated Successfully", progress})
}

module.exports = { getCourseProgress, getVideoProgress, updateVideoProgress };