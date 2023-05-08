/* eslint-disable @typescript-eslint/no-var-requires */
import {courseCreateValidation, courseUpdateValidation} from '../utils/validations';
const course_router = require("express").Router();
const courseController = require("../controllers/courseController");
const authCheck = require("../middlewares/authMiddleware");

course_router.get('/', authCheck, courseController.getAllAvailableCourses);
course_router.get('/:courseId/start', authCheck, courseController.getCourseEnrollment);
course_router.get('/:courseId', authCheck, courseController.getCourseTemplate);
course_router.get('/templates', authCheck, courseController.getAllCourseTemplates);
course_router.get('/enrollments', authCheck, courseController.getAllCourseEnrollmentsOfUser);
course_router.get('/createdCourses', authCheck, courseController.getAllCourseTemplatesOfUser);
course_router.get('/:courseId/progress', authCheck, courseController.getProgressOfCourse);
course_router.post('/', authCheck, courseCreateValidation, courseController.createCourse);
course_router.post('/:courseId/enroll', authCheck, courseController.enrollInCourse);
course_router.post('/:courseId/unenroll', authCheck, courseController.unEnrollFromCourse);
course_router.post('/:courseId/start', authCheck, courseController.startCourse);
course_router.post('/:courseId/complete', authCheck, courseController.completeCourse);
course_router.put('/:courseId', authCheck, courseUpdateValidation, courseController.updateCourseTemplate);
course_router.delete('/:courseId', authCheck, courseController.removeCourseTemplate);

module.exports = course_router;