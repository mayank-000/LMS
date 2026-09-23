const { prisma } = require("../lib/prisma.js")

const tutorAuthMiddleware = async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "Please attach userId in params" });
    }
    const user = await prisma.tutor.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true
        }
    })
    if (!user) {
        return res.status(404).json({ message: "Invalid UserId" });
    }
    req.tutorId = userId;
    next();
}

module.exports = tutorAuthMiddleware