const { prisma } = require("../lib/prisma.js");

const tutorCourseMiddleware = async (req, res, next) => {
    const tutorId = req.tutorId;
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(400).json({ message: "Attach courseId in the params "});
    }
    const course = await prisma.course.findFirst({
        where: {
            id: courseId,
            tutorId: tutorId
        },
        select: {
            id: true,
        }
    });
    if (!course) {
        return res.status(404).json({ message: "Invalid courseId or course does not belong to this tutor" });
    }
    req.courseId = courseId;
    next();
}

module.exports = tutorCourseMiddleware