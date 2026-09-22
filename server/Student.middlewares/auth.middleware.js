const { prisma } = require("../lib/prisma.js")

const studentAuthMiddleware = async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "Please attach userId in params" });
    }
    const user = await prisma.student.findUnique({
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
    req.studentId = userId;
    next();
}