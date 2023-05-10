/* eslint-disable @typescript-eslint/no-var-requires */
// import {taskCreateUpdateValidation} from '../utils/validations';
const task_router = require("express").Router();
const taskController = require("../controllers/taskController");
const authCheck = require("../middlewares/authMiddleware");

task_router.post('/:courseId/tasks', authCheck, taskController.createTaskForCourse); // WORKS
task_router.put('/:courseId/tasks/:taskId/edit', authCheck, taskController.updateTaskForCourse); // WORKS
task_router.get('/:courseId/tasks/:taskId', authCheck, taskController.getCourseTaskEnrollment); // WORKS
task_router.get('/:courseId/tasks', authCheck, taskController.getAllCourseTaskTemplates); // WORKS
task_router.delete('/:courseId/tasks/:taskId', authCheck, taskController.deleteCourseTask); // WORKS
task_router.delete('/:courseId/tasks', authCheck, taskController.deleteAllCourseTasks);
task_router.post('/:courseEnrollmentId/tasks/:taskId/check', authCheck, taskController.checkCourseTask);
task_router.post('/:courseEnrollmentId/tasks/:taskId/submit', authCheck, taskController.submitCourseTask);

module.exports = task_router;