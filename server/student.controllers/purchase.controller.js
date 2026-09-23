const { prisma } = require("../lib/prisma.js");

const purchaseCourse = async (req, res) => {
    const studentId = req.studentId;
    const { courseId } = req.headers;
    
    if (!courseId) {
        return res.status(401).json({
            message: "Please attach courseId in the body"
        })
    }
    const courseExist = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });
    if (!courseExist) {
        return res.status(404).json({
            message: "Invalid course Id or this course may be deleted!"
        })
    }
    const purchase = await prisma.purchases.create({
        data: {
            studentId: studentId,
            courseId: courseId
        }
    });
    return res.json(purchase);
}

module.exports = { purchaseCourse }