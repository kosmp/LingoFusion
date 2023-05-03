/* eslint-disable @typescript-eslint/no-var-requires */
import {taskCreateUpdateValidation} from '../utils/validations';
const task_router = require("express").Router();
const taskController = require("../controllers/taskController");
const authCheck = require("../middlewares/authMiddleware");

task_router.post('/:courseId/tasks', authCheck, taskCreateUpdateValidation, taskController.createTaskForCourse);
task_router.put('/:courseId/tasks/:taskId', authCheck, taskCreateUpdateValidation, taskController.updateTaskForCourse);
task_router.get('/:courseId/tasks/:taskId', authCheck, taskController.getCourseTask);
task_router.get('/:courseId/tasks', authCheck, taskController.getAllCourseTasks);
task_router.delete('/:courseId/tasks/:taskId', authCheck, taskController.deleteCourseTask);
task_router.delete('/:courseId/tasks', authCheck, taskController.deleteAllCourseTasks);

module.exports = task_router;