const { prisma } = require("../lib/prisma.js");

const getContents = async (req, res) => {
    const courseId = req.courseId;
    const contents = await prisma.video.findMany({
        where: {
            courseId: courseId
        },
        orderBy: {
            order: "asc"
        }
    })
    return res.json(contents);
}

const getEnrolledStudents = async (req, res) => {
    const courseId = req.courseId;
    const purchases = await prisma.purchases.findMany({
        where: {
            courseId: courseId
        },
        include: {
            student: true
        },
        orderBy: {
            createdAt: "asc"
        }
    })
    const students = purchases.map(purchase => purchase.student)
    return res.json(students);
}

const createCourse = async (req, res) => {
    const tutorId = req.tutorId;
    const { title, description } = req.body;
    const course = await prisma.course.create({
        data: {
            title: title,
            description: description,
            tutorId: tutorId
        }
    });
    return res.json(course.id);
}

const deleteCourse = async (req, res) => {
    const courseId = req.courseId;
    await prisma.course.delete({
        where: {
            id: courseId
        }
    })
    return res.json({ Message: "Delete Course Successfully!" });
}
