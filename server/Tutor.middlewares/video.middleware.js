const { prisma } = require("../lib/prisma.js");

const tutorVideoMiddleware = async (req, res, next) => {
    const courseId = req.courseId;
    const { videoId } = req.params;

    if (!videoId) {
        return res.status(400).json({ message: "Attach videoId in the params" });
    }
    const video = await prisma.video.findFirst({
        where: {
            id: videoId,
            courseId: courseId
        },
        select: {
            id: true,
        }
    });
    if (!video) {
        return res.status(404).json({ message: "Invalid videoId or video does not belong to this course" });
    }
    req.videoId = videoId;
    next();
}

module.exports = tutorVideoMiddleware;