const express = require("express");

const { TutorsignIn, TutorsignUp, getTutor, getTutorCourses } = require("../tutor.controllers/auth.controller.js");
const { getContents, getEnrolledStudents, createCourse, deleteCourse } = require("../tutor.controllers/course.controller.js");
const { getLikes, getComments, deleteVideo, uploadVideo } = require("../tutor.controllers/upload.controller.js");

const tutorAuthMiddleware = require("../Tutor.middlewares/auth.middleware.js"); 
const tutorCourseMiddleware = require("../Tutor.middlewares/course.middleware.js");
const tutorVideoMiddleware = require("../Tutor.middlewares/video.middleware.js");

const router = express.Router();

router.post("/signup", TutorsignUp);
router.post("/signip", TutorsignIn);

router.get("/profile", tutorAuthMiddleware, getTutor);
router.get("/courses", tutorAuthMiddleware, getTutorCourses);
router.post("/create", tutorAuthMiddleware, createCourse);

router.get("/contents", tutorAuthMiddleware, tutorCourseMiddleware, getContents);
router.get("/students", tutorAuthMiddleware, tutorCourseMiddleware, getEnrolledStudents);
router.delete("/delete_course", tutorAuthMiddleware, tutorCourseMiddleware, deleteCourse);
router.post("/upload", tutorAuthMiddleware, tutorCourseMiddleware, uploadVideo);

router.get("/likes", tutorAuthMiddleware, tutorCourseMiddleware, tutorVideoMiddleware, getLikes);
router.get("/comments", tutorAuthMiddleware, tutorCourseMiddleware, tutorVideoMiddleware, getComments);
router.delete("/delete_video", tutorAuthMiddleware, tutorCourseMiddleware, tutorVideoMiddleware, deleteVideo);

module.exports = router;