const express = require("express");

const { StudentsignIn, StudentsignUp, getStudent, getStudentCourses } = require("../student.controllers/auth.controller.js");
const { purchaseCourse } = require("../student.controllers/purchase.controller.js");
const { getVideo, likedVideo, commentVideo } = require("../student.controllers/action.controller.js");
const { getVideoProgress, updateVideoProgress, getCourseProgress } = require("../student.controllers/progress.controller.js");

const studentAuthMiddleware = require("../Student.middlewares/auth.middleware.js");
const studentCourseMiddleware = require("../Student.middlewares/course.middleware.js");
const studentVideoMiddleware = require("../Student.middlewares/video.middleware.js")

const router = express.Router();

router.post("/signup", StudentsignUp);
router.post("/signin", StudentsignIn);

router.get("/profile", studentAuthMiddleware, getStudent);
router.get("/courses", studentAuthMiddleware, getStudentCourses);
router.post("/purchase", studentAuthMiddleware, purchaseCourse);

router.get("/course_progress", studentAuthMiddleware, studentCourseMiddleware, getCourseProgress);
router.get("/video", studentAuthMiddleware, studentCourseMiddleware, getVideo);

router.post("/like", studentAuthMiddleware, studentCourseMiddleware, studentVideoMiddleware, likedVideo);
router.post("/comment", studentAuthMiddleware, studentCourseMiddleware, studentVideoMiddleware, commentVideo);
router.get("/video_progress", studentAuthMiddleware, studentCourseMiddleware, studentVideoMiddleware, getVideoProgress);
router.post("/update", studentAuthMiddleware, studentCourseMiddleware, studentVideoMiddleware, updateVideoProgress);

module.exports = router;