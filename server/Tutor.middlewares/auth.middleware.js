const { prisma } = require("../lib/prisma.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const tutorAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.tutorToken;
    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.TUTOR_JWT_SECRET
        );
        if (decoded.role !== "tutor") { 
            return res.status(403).json({ message: "Access denied! "})
        };

        const userId = decoded.id;
        const user = await prisma.tutor.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: "Invalid UserId" });
        };
    
        req.tutorId = userId;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or Expired Token!",
        });
    }
}

module.exports = tutorAuthMiddleware