/* eslint-disable @typescript-eslint/no-var-requires */
import {courseCreateValidation, courseUpdateValidation} from '../utils/validations';
const course_router = require("express").Router();
const courseController = require("../controllers/courseController");
const authCheck = require("../middlewares/authMiddleware");

course_router.get('/', authCheck, courseController.getAllCourses);
course_router.get('/:courseId', courseController.getCourse);
course_router.post('/', authCheck, courseCreateValidation, courseController.createCourse);
course_router.delete('/:courseId', authCheck, courseController.removeCourse);
course_router.put('/:courseId', authCheck, courseUpdateValidation, courseController.updateCourse);

module.exports = course_router;