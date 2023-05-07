/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
const taskService = require('../services/taskService');
import {Request, Response, NextFunction} from 'express';
import {CourseEnrollment} from '../models/courseEnrollment';
import {RequestWithUserFromMiddleware} from '../utils/types';
import {ObjectId} from 'mongodb';
import {FillInGaps} from '../models/fillInGaps';
import {TestQuestion} from '../models/testQuestion';
import {Theory} from '../models/theory';
import {TaskType} from '../utils/enums';
import {TaskTemplate} from '../models/taskTemplate';
import {TaskEnrollment} from '../models/taskEnrollment';
import {StatusType} from '../utils/enums';
import {CourseTemplate} from '../models/courseTemplate';


class TaskController {
    async createTaskForCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId = req.params.courseId;
            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));

            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }
                
            let taskTemplateId: ObjectId;
            if (req.body.taskType === TaskType.FillGaps) {
                taskTemplateId = await FillInGaps.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    text: req.body.text,
                    blanks: req.body.blanks,
                    expForTrueTask: req.body.expForTrueTask
                });
            } else if (req.body.taskType === TaskType.Test) {
                taskTemplateId = await TestQuestion.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    question: req.body.question,
                    trueAnswers: req.body.trueAnswers,
                    expForTrueTask: req.body.expForTrueTask 
                });
            } else if (req.body.taskType === TaskType.Theory) {
                taskTemplateId = await Theory.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    references: req.body.references,
                    images: req.body.imagesUrl,
                    expForTrueTask: 0
                });
            } else {
                return next(ApiError.BadRequest(`Invalid task type: ${req.body.taskType}`))
            }
    
            CourseTemplate.addTaskId(new ObjectId(courseId), taskTemplateId);
    
            return res.status(200).json({
                success: true,
                taskId: taskTemplateId,
                taskType: req.body.taskType
            });
        } catch (e) {
            return next(e);
        }
    }

    async updateTaskForCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId = req.params.courseId;
            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));

            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            const taskId = req.params.taskId;
            const task = await TaskTemplate.findTaskById(new ObjectId(taskId));
    
            if (!task) {
                return next(ApiError.NotFoundError(`Can't find task with id: ${taskId}. Maybe task wasn't created`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't update tasks in course he didn't create`));
            }

            const tasks: Array<ObjectId> = (await CourseTemplate.findCourseById(new ObjectId(courseId)))?.taskTemplates;
            const taskExists = tasks.some(task => task.equals(new ObjectId(taskId)));
            if (!taskExists) {
                return next(ApiError.AccessForbidden(`This task not from this course. So you can't update it`));
            }

            if (req.body.taskType === TaskType.FillGaps) {
                await FillInGaps.updateTask({
                    _id: new ObjectId(taskId),
                    title: req.body.title,
                    description: req.body.description,
                    text: req.body.text,
                    blanks: req.body.blanks,
                    expForTrueTask: req.body.expForTrueTask
                });
                return res.status(200).json({sucess: true});
            } else if (req.body.taskType === TaskType.Test) {
                await TestQuestion.updateTask({
                    _id: new ObjectId(taskId),
                    title: req.body.title,
                    description: req.body.description,
                    question: req.body.question,
                    trueAnswers: req.body.trueAnswers,
                    expForTrueTask: req.body.expForTrueTask 
                });
                return res.status(200).json({sucess: true});
            } else if (req.body.taskType === TaskType.Theory) {
                await Theory.updateTask({
                    _id: new ObjectId(taskId),
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    references: req.body.references,
                    images: req.body.imagesUrl,
                    expForTrueTask: 0
                });
                return res.status(200).json({sucess: true});
            } else {
                return next(ApiError.BadRequest(`Invalid task type: ${req.body.taskType}`))
            }
        } catch (e) {
            return next(e);
        }
    }
    
    async getCourseTaskEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
    
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            const taskId = req.params.taskId;
            const task = await TaskEnrollment.findTaskById(new ObjectId(taskId));
    
            if (!task) {
                return next(ApiError.NotFoundError(`Can't find task with id: ${taskId}. Maybe task wasn't created`));
            }

            const tasks: Array<ObjectId> = (await CourseEnrollment.findCourseById(new ObjectId(courseId)))?.tasks;
            const taskExists = tasks.some(task => task.equals(new ObjectId(taskId)));
            if (!taskExists) {
                return next(ApiError.AccessForbidden(`This task not from this course. So you can't get it`));
            }

            return res.status(200).json(task);
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourseTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            const course = await Course.findCourseById(new ObjectId(courseId));
    
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            const tasks: Array<ObjectId> = await Course.get_tasksById(new ObjectId(courseId));

            return res.status(200).json(await taskService.getTasksByListOfIds(tasks));
        } catch (e) {
            return next(e);
        }
    }

    async deleteCourseTask(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const taskId = req.params.taskId;
            console.log(taskId);
            const task = await Task.findTaskById(new ObjectId(taskId));
            console.log(task);
            if (!task) {
                return next(ApiError.NotFoundError(`Can't find task with id: ${taskId}. Maybe task wasn't created`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete task from course he didn't create`));
            }

            const tasks: Array<ObjectId> = await Course.get_tasksById(new ObjectId(courseId)); 
            if (!tasks.some(task => task.equals(new ObjectId(taskId)))) {
                return next(ApiError.AccessForbidden(`This task not from this course. So you can't delete it`));
            }

            await Course.removeTaskByIdFromCourseTasks(course._id, new ObjectId(taskId));    // updated list of tasks inside course

            const deleteResult = await Task.deleteTaskById(new ObjectId(taskId));    // removed from task collection in BD

            if (!deleteResult) {
                return next(ApiError.NotFoundError(`Can't remove task with id: ${taskId}`));
            }

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }

    async deleteAllCourseTasks(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete tasks from course he didn't create`));
            }

            const tasks: Array<ObjectId> = await Course.get_tasksById(new ObjectId(courseId));
            
            if (tasks.length === 0) {
                return res.status(200).json({ message: "Nothing to delete. Tasks: []" })
            }

            for (const task of tasks) {
              await Course.removeTaskByIdFromCourseTasks(course._id, new ObjectId(task));
              const deleteResult = await Task.deleteTaskById(new ObjectId(task));
            
              if (!deleteResult) {
                return next(ApiError.NotFoundError(`Can't remove task with id: ${task}`));
              }
            }
            

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }

    async submitCourseTask(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }
    
            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't submit task in course he hasn't enrolled`));
            }
    
            const taskEnrollmentId = req.params.taskId;
    
            const taskEnrollment = await TaskEnrollment.findTaskById(new ObjectId(taskEnrollmentId));
    
            if (!taskEnrollment) {
                return next(ApiError.NotFoundError(`Can't find taskEnrollment with id: ${taskEnrollmentId}`));
            }

            if (taskEnrollment.status === StatusType.Completed) {
                return next(ApiError.AccessForbidden(`You can submit task only 1 time`));
            }
    
            const taskTemplateId = taskEnrollment.taskTemplateId;
            const taskTemplate = await TaskTemplate.findTaskById(taskTemplateId);
    
            if (!taskTemplate) {
                return next(ApiError.NotFoundError(`Can't find taskTemplate with id: ${taskTemplateId}`));
            }
    
            const taskType: TaskType = taskEnrollment.taskType; 
        
            let isCorrect: boolean;
            if (taskType === 'test') {
                isCorrect = await TestQuestion.check(taskTemplateId, taskEnrollment.userAnswers);
            } else if (taskType === 'fillgaps') {
                isCorrect = await FillInGaps.check(taskTemplateId, taskEnrollment.userAnswers);
            } else if (taskType === 'theory') {
                isCorrect = await Theory.check(taskTemplateId, taskEnrollment.userAnswers);
            } else {
                return next(ApiError.BadRequest(`Invalid task type`));
            }
    
            if (isCorrect) {
                await TaskEnrollment.updateTask({
                    _id: new ObjectId(taskEnrollmentId),
                    status: StatusType.Completed,
                    expForTask: taskTemplate.expForTrueTask,
                    completedAt: new Date(),
                });

                return res.status(200).json({expForTaskGained: taskTemplate.expForTrueTask});
            } else {
                await TaskEnrollment.updateTask({
                    _id: new ObjectId(taskEnrollmentId),
                    status: StatusType.Completed,
                    expForTask: 0,
                    completedAt: new Date(),
                })
                
                return res.status(200).json({expForTaskGained: 0});
            }
        } catch (e) {
            return next(e)
        }
    }
}

module.exports = new TaskController();