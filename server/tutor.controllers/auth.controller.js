const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.TUTOR_JWT_SECRET;

const TutorsignUp = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const Tutor = await prisma.tutor.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        return res.status(201).json({ message: "SignUp Successful!", user: Tutor});
    } catch (error) {
        // User already exists
        if (error.code === "P2002") {
            return res.status(409).json({ message: "username already exists" });
        }
        return res.status(500).json({ message: "Internal Server error" });
    }
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
    };

    const token = jwt.sign(
        {
            id: userExist.id,
            role: "tutor"
        }, 
        JWT_SECRET, 
        {
            expiresIn: "7d"
        }
    );
    res.cookie("tutorToken", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    });

    return res.status(200).json({
        message: "Login Successful"
    });
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

module.exports = { TutorsignUp, TutorsignIn, getTutor, getTutorCourses };