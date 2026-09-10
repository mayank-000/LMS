const Courses = require(".../models")

const createCourse = async (req, res) => {
    const tutor = req.tutor;
    const { title, description, pricing, thumbnail, language, tags } = req.body;

    if (!title) res.json(403).json({ message: "Title is required!" })

    const newCourse = {
        title,
        description,
        pricing,
        thumbnail,
        language,
        tags
    }

    
}