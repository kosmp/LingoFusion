import {taskCreateUpdateValidation, taskSubmitValidation} from '../utils/validations';
const task_router = require("express").Router();
const taskController = require("../controllers/taskController");
const authCheckTask = require("../middlewares/authMiddleware");

task_router.post('/:courseId/tasks', authCheckTask, taskCreateUpdateValidation, taskController.createTaskForCourse);
task_router.put('/:courseId/tasks/:taskId/edit', authCheckTask, taskCreateUpdateValidation, taskController.updateTaskForCourse);
task_router.get('/:courseEnrollmentId/tasks/:taskEnrollmentId/taskEnrollment', authCheckTask, taskController.getCourseTaskEnrollment);
task_router.get('/:courseId/tasks/:taskId/taskTemplate', authCheckTask, taskController.getTaskTemplateOfCourse);
task_router.get('/:courseId/tasks', authCheckTask, taskController.getAllCourseTaskTemplates);
task_router.delete('/:courseId/tasks/:taskId', authCheckTask, taskController.deleteCourseTask);
task_router.delete('/:courseId/tasks', authCheckTask, taskController.deleteAllCourseTasks);
task_router.post('/:courseEnrollmentId/tasks/:taskEnrollmentId/submit', authCheckTask, taskSubmitValidation, taskController.submitCourseTask);
task_router.get('/:courseEnrollmentId/nextTask', authCheckTask, taskController.getNextTaskEnrollmentOfCourse);
task_router.get('/:courseEnrollmentId/prevTask', authCheckTask, taskController.getPrevTaskEnrollmentOfCourse);

module.exports = task_router;