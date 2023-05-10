/* eslint-disable @typescript-eslint/no-var-requires */
import {courseCreateValidation, courseUpdateValidation} from '../utils/validations';
const course_router = require("express").Router();
const courseController = require("../controllers/courseController");
const authCheck = require("../middlewares/authMiddleware");

course_router.get('/templates/all', authCheck, courseController.getAllCourseTemplates); // WORKS
course_router.get('/enrollments', authCheck, courseController.getAllCourseEnrollmentsOfUser); // WORKS
course_router.get('/templates/mine', authCheck, courseController.getAllCourseTemplatesOfUser); // WORKS
course_router.get('/', authCheck, courseController.getAllAvailableCourses); // WORKS
course_router.get('/:courseEnrollmentId/enrollment', authCheck, courseController.getCourseEnrollment); // WORKS
course_router.get('/:courseId', authCheck, courseController.getCourseTemplate); // WORKS
course_router.get('/:courseEnrollmentId/progress', authCheck, courseController.getProgressOfCourse);
course_router.post('/', authCheck, courseCreateValidation, courseController.createCourse); // WORKS
course_router.post('/:courseId/enroll', authCheck, courseController.enrollInCourse); // WORKS
course_router.post('/:courseEnrollmentId/unenroll', authCheck, courseController.unEnrollFromCourse);
course_router.post('/:courseEnrollmentId/start', authCheck, courseController.startCourse); // WORKS
course_router.post('/:courseEnrollmentId/complete', authCheck, courseController.completeCourse);
course_router.put('/:courseId', authCheck, courseUpdateValidation, courseController.updateCourseTemplate); // WORKS
course_router.delete('/:courseId', authCheck, courseController.removeCourseTemplate); // WORKS

module.exports = course_router;