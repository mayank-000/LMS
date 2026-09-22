const { prisma } = require("../lib/prisma.js");

const tutorVideoMiddleware = async (req, res, next) => {
    const courseId = req.courseId;
    const { videoId } = req.params;

    if (!videoId) {
        return res.status(400).json({ message: "Attach videoId in the params "});
    }
    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        },
        select: {
            id: true,
            courseId: true,
        }
    });
    if (!video) {
        return res.status(404).json({ message: "Invalid videoId "});
    }
    if (video.courseId !== courseId) {
        return res.status(403).json({ message: "You are not the ownwer of this video" })
    }
    req.videoId = videoId;
    next();
}