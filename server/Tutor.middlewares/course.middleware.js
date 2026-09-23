const { prisma } = require("../lib/prisma.js");

const tutorCourseMiddleware = async (req, res, next) => {
    const tutorId = req.tutorId;
    const { courseId } = req.query;

    if (!courseId) {
        return res.status(400).json({ message: "Attach courseId in the params "});
    }
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        },
        select: {
            id: true,
            tutorId: true
        }
    });
    if (!course) {
        return res.status(404).json({ message: "Invalid courseId "});
    }
    if (course.tutorId !== tutorId) {
        return res.status(403).json({ message: "You are not the ownwer of this course" })
    }
    req.courseId = courseId;
    next();
}

module.exports = tutorCourseMiddleware