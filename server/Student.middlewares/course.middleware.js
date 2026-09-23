const { prisma } = require("../lib/prisma.js");

const studentCourseMiddleware = async (req, res, next) => {
    const studentId = req.studentId;
    const { courseId } = req.query;

    if (!courseId) {
        return res.status(400).json({ message: "Attach courseId in the params "});
    }
    const purchase = await prisma.purchases.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId
            }
        }
    });
    if (!purchase) {
        return res.status(404).json({ message: "You are not subscribed to this course" });
    }
    req.courseId = courseId;
    next();
}

module.exports = studentCourseMiddleware