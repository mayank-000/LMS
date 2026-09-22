const { prisma } = require("../lib/prisma.js");

const purchaseCourse = async (req, res) => {
    const studentId = req.studentId;
    const courseId = req.courseId;
    const purchase = await prisma.purchases.create({
        data: {
            studentId: studentId,
            courseId: courseId
        }
    });
    return res.json(purchase);
}

