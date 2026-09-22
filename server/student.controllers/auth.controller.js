const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const StudentsignUp = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.student.create({
        data: {
            username,
            password: hashedPassword
        }
    })
    return res.json(student.id)
}

const StudentsignIn = async (req, res) => {
    const { username, password } = req.body;
    const userExist = await prisma.student.findUnique({
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

const getStudent = async (req, res) => {
    const studentId = req.studentId;
    const student = await prisma.student.findUnique({
        where: {
            id: studentId
        }
    })
    return res.json(student.id)
}

const getStudentCourses = async (req, res) => {
    const studentId = req.studentId;
    const purchases = await prisma.purchases.findMany({
        where: {
            studentId: studentId
        },
        include: {
            course: true
        },
        orderBy: {
            createdAt: "asc"            
        }
    })
    const courses = purchases.map(purchase => purchase.course);
    return res.json(courses)
}

