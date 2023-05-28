import {Response, NextFunction} from 'express';
import {CourseEnrollment} from '../models/courseEnrollment';
import {RequestWithUserFromMiddleware} from '../utils/types';
import {ObjectId} from 'mongodb';
import {FillInGaps} from '../models/fillInGaps';
import {TestQuestion} from '../models/testQuestion';
import {Theory} from '../models/theory';
import {TaskType} from '../utils/enums';
import {TaskTemplate} from '../models/taskTemplate';
import {TaskEnrollment} from '../models/taskEnrollment';
import {TaskStatusType} from '../utils/enums';
import {CourseTemplate} from '../models/courseTemplate';
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/apiError');
const taskService = require('../services/taskService');
const courseService = require('../services/courseService');

class TaskController {
    async createTaskForCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            
            const userId = req.user._id;
            const courseId = req.params.courseId;
            await courseService.getCourseTemplate(courseId, userId.toString());
            await courseService.checkPublicFalseInCourseTemplate(courseId);

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
                    options: req.body.options,
                    expForTrueTask: req.body.expForTrueTask
                });
            } else if (req.body.taskType === TaskType.Theory) {
                taskTemplateId = await Theory.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    references: req.body.references,
                    images: req.body.images,
                    expForTrueTask: req.body.expForTrueTask
                });
            } else {
                return next(ApiError.BadRequest(`Invalid task type: ${req.body.taskType}`));
            }
    
            await CourseTemplate.addTaskId(new ObjectId(courseId), taskTemplateId);
    
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

            const userId = req.user._id;
            const courseId = req.params.courseId;
            const course = await courseService.getCourseTemplate(courseId, userId.toString());
            await courseService.checkPublicFalseInCourseTemplate(courseId);

            const taskId = req.params.taskId;
            const task = await taskService.getTaskTemplate(taskId);

            await taskService.isTaskTemplateFromCourseTemplate(course, taskId);
            
            if (task.taskType != req.body.taskType) {
                return next(ApiError.BadRequest("Incorrect taskType. The created task is of a different type"));
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
                    options: req.body.options,
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
    
    async getCourseTaskEnrollment(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId: ObjectId = req.user._id;
            const courseId = req.params.courseEnrollmentId;
            const course = await courseService.getCourseEnrollment(courseId, userId.toString());

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`Course hasn't started. So user can't get courseTaskEnrollment`));
            }

            const taskId = req.params.taskEnrollmentId;
            const task = await taskService.getTaskEnrollment(taskId);
            await taskService.isTaskEnrollmentFromCourseEnrollment(course, taskId);

            if (!task.startedAt) {
                await TaskEnrollment.updateTask({
                    _id: new ObjectId(taskId),
                    startedAt: new Date()
                });
            }

            await CourseEnrollment.updateCourse({
                _id: new ObjectId(courseId),
                currentTaskId: new ObjectId(taskId),
                currentTaskType: task.taskType
            });
            
            return res.status(200).json(await taskService.getTaskEnrollment(taskId));
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourseTaskTemplates(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId: ObjectId = req.user._id;
            const courseId = req.params.courseId;
            const course = await courseService.getCourseTemplate(courseId, userId.toString());
            await courseService.checkPublicFalseInCourseTemplate(courseId);

            return res.status(200).json(await taskService.getTaskTemplatesByListOfIds(course.taskTemplates));
        } catch (e) {
            return next(e);
        }
    }

    async deleteCourseTask(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId = req.user._id;
            const courseId = req.params.courseId;
            const course = await courseService.getCourseTemplate(courseId, userId.toString());
            await courseService.checkPublicFalseInCourseTemplate(courseId);

            const taskId = req.params.taskId;
            await taskService.getTaskTemplate(taskId);
            await taskService.isTaskTemplateFromCourseTemplate(course, taskId);
            await CourseTemplate.removeTaskId(course._id, new ObjectId(taskId));

            const deleteResult = await TaskTemplate.deleteTaskById(new ObjectId(taskId));
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
            const userId = req.user._id;
            const courseId = req.params.courseId;
            const course = await courseService.getCourseTemplate(courseId, userId.toString());
            await courseService.checkPublicFalseInCourseTemplate(courseId);

            const tasks: Array<ObjectId> = course.taskTemplates;
            for (const task of tasks) {
              await CourseTemplate.removeTaskId(course._id, new ObjectId(task));

              const deleteResult = await TaskTemplate.deleteTaskById(new ObjectId(task));
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }

            const userId: ObjectId = req.user._id;
            const courseId = req.params.courseEnrollmentId;
            const course = await courseService.getCourseEnrollment(courseId, userId.toString());

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`Course hasn't started`));
            }
    
            const taskEnrollmentId = req.params.taskEnrollmentId;
            let taskEnrollment = await taskService.getTaskEnrollment(taskEnrollmentId);

            if (!taskEnrollment.startedAt) {
                return next(ApiError.AccessForbidden(`Task hasn't started`));
            }

            if (taskEnrollment.status === TaskStatusType.Completed) {
                return next(ApiError.AccessForbidden(`You can submit task only 1 time`));
            }

            let userAnswers = req.body.userAnswers;
            if (userAnswers == null || userAnswers.length == 0) {
                userAnswers = new Array<string>;
            }

            await TaskEnrollment.updateTask({
                _id: new ObjectId(taskEnrollmentId),
                userAnswers: userAnswers
            })

            taskEnrollment = await taskService.getTaskEnrollment(taskEnrollmentId);
    
            const taskTemplateId = taskEnrollment.taskTemplateId;
            const taskTemplate = await taskService.getTaskTemplate(taskTemplateId.toString());
    
            const taskType: TaskType = taskEnrollment.taskType; 
        
            let trueAnswers;

            let isCorrect: boolean;
            if (taskType === 'test') {
                isCorrect = await TestQuestion.check(taskTemplateId, taskEnrollment.userAnswers);

                trueAnswers = taskTemplate.trueAnswers;
            } else if (taskType === 'fillInGaps') {
                isCorrect = await FillInGaps.check(taskTemplateId, taskEnrollment.userAnswers);

                trueAnswers = taskTemplate.blanks;
            } else if (taskType === 'theory') {
                isCorrect = await Theory.check(taskTemplateId, taskEnrollment.userAnswers);
                
                trueAnswers = null;
            } else {
                return next(ApiError.BadRequest(`Invalid task type`));
            }

            if (isCorrect) {
                await TaskEnrollment.updateTask({
                    _id: new ObjectId(taskEnrollmentId),
                    status: TaskStatusType.Completed,
                    expForTask: taskTemplate.expForTrueTask,
                    completedAt: new Date()
                });

                return res.status(200).json({
                    expForTaskGained: taskTemplate.expForTrueTask,
                    trueAnswers: trueAnswers
                });
            } else {
                await TaskEnrollment.updateTask({
                    _id: new ObjectId(taskEnrollmentId),
                    status: TaskStatusType.Completed,
                    expForTask: 0,
                    completedAt: new Date()
                });

                return res.status(200).json({
                    expForTaskGained: 0,
                    trueAnswers: trueAnswers
                });
            }
        } catch (e) {
            return next(e);
        }
    }

    async getNextTaskEnrollmentOfCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId: ObjectId = req.user._id;
            const courseId = req.params.courseEnrollmentId;
            const course = await courseService.getCourseEnrollment(courseId, userId.toString());

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`Course hasn't started`));
            }

            const taskEnrollmentIds: Array<ObjectId> = course.tasks;
            if (taskEnrollmentIds.length == 0) {
                return next(ApiError.BadRequest("No taskEnrollments in this course"));
            }

            const currentTaskId: ObjectId = course.currentTaskId;
            if (!currentTaskId) {
                return next(ApiError.BadRequest("No currentTaskId in courseEnrollment"));
            }

            const indexOfCurr = taskEnrollmentIds.findIndex(id => id.equals(currentTaskId));
            if (indexOfCurr + 1 != taskEnrollmentIds.length) {
                const nextTaskId: ObjectId = taskEnrollmentIds[indexOfCurr + 1];
                
                const nextTaskEnrollment = await taskService.getTaskEnrollment(nextTaskId.toString());

                return res.status(200).json({
                    courseStatus: course.status,
                    courseTitle: course.title,
                    taskEnrollmentId: nextTaskEnrollment._id,
                    taskEnrollmentTitle: nextTaskEnrollment.title,
                    taskEnrollmentType: nextTaskEnrollment.taskType,
                    taskEnrollmentStatus: nextTaskEnrollment.status
                });   
            } else {
                return next(ApiError.AccessForbidden(`Next taskEnrollment doesn't exist`));
            }
        } catch (e) {
            return next(e);
        }
    }

    async getPrevTaskEnrollmentOfCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId: ObjectId = req.user._id;
            const courseId = req.params.courseEnrollmentId;
            const course = await courseService.getCourseEnrollment(courseId, userId.toString());

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`Course hasn't started`));
            }

            const taskEnrollmentIds: Array<ObjectId> = course.tasks;
            if (taskEnrollmentIds.length == 0) {
                return next(ApiError.BadRequest("No taskEnrollments in this course"));
            }

            const currentTaskId: ObjectId = course.currentTaskId;
            if (!currentTaskId) {
                return next(ApiError.BadRequest("No currentTaskId in courseEnrollment"));
            }

            const indexOfCurr = taskEnrollmentIds.findIndex(id => id.equals(currentTaskId));
            if (indexOfCurr !== 0) {
                const prevTaskId: ObjectId = taskEnrollmentIds[indexOfCurr - 1];

                const prevTaskEnrollment = await taskService.getTaskEnrollment(prevTaskId.toString());

                return res.status(200).json({
                    courseTitle: course.title,
                    taskEnrollmentId: prevTaskEnrollment._id,
                    taskEnrollmentTitle: prevTaskEnrollment.title,
                    taskEnrollmentType: prevTaskEnrollment.taskType,
                    taskEnrollmentStatus: prevTaskEnrollment.status
                });
            } else {
                return next(ApiError.AccessForbidden(`Prev taskEnrollment doesn't exist`));
            }
        } catch (e) {
            return next(e);
        }
    }

    async getTaskTemplateOfCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId = req.user._id;
            const courseId = req.params.courseId;
            await courseService.getCourseTemplate(courseId, userId.toString());
            await courseService.checkPublicFalseInCourseTemplate(courseId);

            const taskId = req.params.taskId;
            const task = await taskService.getTaskTemplate(taskId);
            
            return res.status(200).json(task);
        } catch(e) {
            return next(e);
        }
    }
}

module.exports = new TaskController();