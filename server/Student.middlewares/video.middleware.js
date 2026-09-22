const { prisma } = require("../lib/prisma.js");

const studentVideoMiddleware = async (req, res, next) => {
    const courseId = req.courseId;
    const { videoId } = req.params;

    if (!videoId) {
        return res.status(400).json({ message: "Attach videoId in the params "});
    }
    const video = await prisma.video.findUnique({
        where: {
            id: videoId,
            courseId: courseId
        },
        select: {
            id: true
        }
    });
    if (!video) {
        return res.status(404).json({ message: "Invalid videoId" });
    }
    req.videoId = videoId;
    next();
}