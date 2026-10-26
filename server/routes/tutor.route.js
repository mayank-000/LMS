const express = require("express");
const multer = require("multer");

const { TutorsignIn, TutorsignUp, getTutor, getTutorCourses } = require("../tutor.controllers/auth.controller.js");
const { getContents, getEnrolledStudents, createCourse, deleteCourse } = require("../tutor.controllers/course.controller.js");
const { getLikes, getComments, deleteVideo, uploadVideo } = require("../tutor.controllers/upload.controller.js");

const tutorAuthMiddleware = require("../Tutor.middlewares/auth.middleware.js"); 
const tutorCourseMiddleware = require("../Tutor.middlewares/course.middleware.js");
const tutorVideoMiddleware = require("../Tutor.middlewares/video.middleware.js");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'tmp/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const router = express.Router();

router.post("/signup", TutorsignUp);
router.post("/signip", TutorsignIn);

router.get("/profile", tutorAuthMiddleware, getTutor);
router.get("/courses", tutorAuthMiddleware, getTutorCourses);
router.post("/create", tutorAuthMiddleware, createCourse);

router.get("/contents/:courseId", tutorAuthMiddleware, tutorCourseMiddleware, getContents);
router.get("/students/:courseId", tutorAuthMiddleware, tutorCourseMiddleware, getEnrolledStudents);
router.delete("/delete_course/:courseId", tutorAuthMiddleware, tutorCourseMiddleware, deleteCourse);
router.post("/upload/:courseId", tutorAuthMiddleware, tutorCourseMiddleware, upload.single('video'), uploadVideo);
// video present under a field named video
// Multer saves the raw file to disk, using your diskstorage config, Multer streams the incoming video into tmp/
// which is your Docker Volume names it Date.now()-originalname, and build req.file.
// req.file = { path: 'tmp/1699999999-lecture1.mp4', filename: '1699999999-lecture1.mp4', ... }

router.get("/likes/:courseId/:videoId", tutorAuthMiddleware, tutorCourseMiddleware, tutorVideoMiddleware, getLikes);
router.get("/comments/:courseId/:videoId", tutorAuthMiddleware, tutorCourseMiddleware, tutorVideoMiddleware, getComments);
router.delete("/delete_video/:courseId/:videoId", tutorAuthMiddleware, tutorCourseMiddleware, tutorVideoMiddleware, deleteVideo);

module.exports = router;