const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ACCESS_SECRET = process.env.TUTOR_JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.TUTOR_JWT_REFRESH_SECRET;

const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");

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
    try {
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
    
        const accessToken = jwt.sign(
            { id: userExist.id, role: "tutor" }, 
            ACCESS_SECRET, 
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { id: userExist.id }, 
            REFRESH_SECRET,
            { expiresIn: "7d" }
        );
    
        await prisma.tutor.update({
            where: { id: userExist.id },
            data: { refreshToken: hashToken(refreshToken) }
        });
    
        res.cookie("tutorToken", accessToken, {
            maxAge: 15*60*1000,
            httpOnly: true,
            sameSite: "strict"
        });
    
        res.cookie("tutorRefreshToken", refreshToken, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: "strict",
            path: "/api/auth/refresh", // sent only to the refresh route
        })
    
        return res.status(200).json({
            message: "Login Successful"
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const refreshToken = async (req, res) => {
    const token = req.cookies?.tutorRefreshToken;
    if (!token) {
        return res.status(401).json({
            message: "No Refresh Token"
        });
    }
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET);
        const user = await prisma.tutor.findUnique({
            where: { id: decoded.id }
        });

        if (!user || user.refreshToken !== hashToken(token)) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, role: "tutor" },
            ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("tutorToken", newAccessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
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

module.exports = { TutorsignUp, TutorsignIn, refreshToken, getTutor, getTutorCourses };