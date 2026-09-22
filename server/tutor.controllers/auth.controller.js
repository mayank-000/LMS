const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const TutorsignUp = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const Tutor = await prisma.tutor.create({
        data: {
            username,
            password: hashedPassword
        }
    })
    return res.json(Tutor.id)
}

const TutorsignIn = async (req, res) => {
    const { username, password } = req.body;
    const userExist = await prisma.tutor.findUnique({
        where: {
            username: username
        }
    });
    if (!userExist) {
        return res.json({ message: "Wrong Credientials!"});
    }
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
        return res.json({ message: "Wrong Credientials!"});
    }
    return res.json(userExist.id);
}

const getTutor = async (req, res) => {
    const tutorId = req.tutorId;
    const Tutor = await prisma.tutor.findUnique({
        where: {
            id: tutorId
        },
        select: {
            username: true
        }
    })
    return res.json(Tutor)
}

const getTutorCourses = async (req, res) => {
    const tutorId = req.tutorId;
    const courses = await prisma.course.findMany({
        where: {
            tutorId: tutorId
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    return res.json(courses)
}

