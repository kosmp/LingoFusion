import {courseCreateValidation, courseUpdateValidation, updateCourseRatingValidation} from '../utils/validations';
const course_router = require("express").Router();
const courseController = require("../controllers/courseController");
const authCheck = require("../middlewares/authMiddleware");

course_router.get('/templates/all', authCheck, courseController.getAllCourseTemplates);
course_router.get('/templates/rated/:ratingThreshold', authCheck, courseController.getRatedCourseTemplates);
course_router.get('/templates/englishlvl/:englishLvl', authCheck, courseController.getCourseTemplatesByEnglishLvl);
course_router.get('/templates/search-by-tag/:tag', authCheck, courseController.getCourseTemplatesByTag);
course_router.get('/enrollments', authCheck, courseController.getAllCourseEnrollmentsOfUser);
course_router.get('/templates/mine', authCheck, courseController.getUserCreatedCourseTemplates);
course_router.get('/', authCheck, courseController.getAllAvailableCourses);
course_router.get('/:courseEnrollmentId/enrollment', authCheck, courseController.getCourseEnrollment);
course_router.get('/:courseId', authCheck, courseController.getCourseTemplate);
course_router.post('/:courseId/publish', authCheck, courseController.publishCourse);
course_router.post('/', authCheck, courseCreateValidation, courseController.createCourse);
course_router.post('/:courseId/enroll', authCheck, courseController.enrollInCourse);
course_router.post('/:courseEnrollmentId/unenroll', authCheck, courseController.unEnrollFromCourse);
course_router.post('/:courseEnrollmentId/start', authCheck, courseController.startCourse);
course_router.post('/:courseEnrollmentId/complete', authCheck, courseController.completeCourse);
course_router.put('/:courseId', authCheck, courseUpdateValidation, courseController.updateCourseTemplate);
course_router.delete('/:courseId', authCheck, courseController.removeCourseTemplate);
course_router.put('/:courseEnrollmentId/rating', authCheck, updateCourseRatingValidation, courseController.updateCourseRating);
course_router.get('/templates/tags', authCheck, courseController.getTags);

module.exports = course_router;