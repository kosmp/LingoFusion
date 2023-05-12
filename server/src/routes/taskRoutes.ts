/* eslint-disable @typescript-eslint/no-var-requires */
// import {taskCreateUpdateValidation} from '../utils/validations';
const task_router = require("express").Router();
const taskController = require("../controllers/taskController");
const authCheck = require("../middlewares/authMiddleware");

task_router.post('/:courseId/tasks', authCheck, taskController.createTaskForCourse);
task_router.put('/:courseId/tasks/:taskId/edit', authCheck, taskController.updateTaskForCourse);
task_router.get('/:courseEnrollmentId/tasks/:taskEnrollmentId/taskEnrollment', authCheck, taskController.getCourseTaskEnrollment);
task_router.get('/:courseId/tasks/:taskId/taskTemplate', authCheck, taskController.getTaskTemplateOfCourse);
task_router.get('/:courseId/tasks', authCheck, taskController.getAllCourseTaskTemplates);
task_router.delete('/:courseId/tasks/:taskId', authCheck, taskController.deleteCourseTask);
task_router.delete('/:courseId/tasks', authCheck, taskController.deleteAllCourseTasks);
task_router.post('/:courseEnrollmentId/tasks/:taskEnrollmentId/submit', authCheck, taskController.submitCourseTask);
task_router.get('/:courseEnrollmentId/nextTask', authCheck, taskController.getNextTaskEnrollmentOfCourse);
task_router.get('/:courseEnrollmentId/prevTask', authCheck, taskController.getPrevTaskEnrollmentOfCourse);

module.exports = task_router;