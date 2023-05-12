/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
const taskService = require('../services/taskService');
const courseService = require('../services/courseService');
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
import {CourseStatusType, TaskStatusType} from '../utils/enums';
import {CourseTemplate} from '../models/courseTemplate';
import {User} from '../models/user';


class TaskController {
    async createTaskForCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId = req.params.courseId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }

            // if other users have started enrolling the course, then refuse to create taskTemplate
            const courseExists: boolean = await courseService.checkExistenceOfCourseEnrollmentWithId(new ObjectId(courseId));
            if (courseExists) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can not create a courseTask while other users are enrolled in this course`));
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
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't update tasks in course he didn't create`));
            }

            // if other users have started enrolling the course, then refuse to change courseTemplate
            const courseExists: boolean = await courseService.checkExistenceOfCourseEnrollmentWithId(new ObjectId(courseId));
            if (courseExists) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can not change a courseTask while other users are enrolled in this course`));
            }

            const taskId = req.params.taskId;
            if (!ObjectId.isValid(taskId)) {
                return next(ApiError.BadRequest("Incorrect taskId"));
            }

            const task = await TaskTemplate.findTaskById(new ObjectId(taskId));
            if (!task) {
                return next(ApiError.NotFoundError(`Can't find task with id: ${taskId}. Maybe task wasn't created`));
            }

            const tasks: Array<ObjectId> = (await CourseTemplate.findCourseById(new ObjectId(courseId)))?.taskTemplates;
            const taskExists = tasks.some(task => task.equals(new ObjectId(taskId)));
            if (!taskExists) {
                return next(ApiError.AccessForbidden(`This task not from this course. So you can't update it`));
            }
            
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
            const courseId = req.params.courseId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
            }

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`Course hasn't started. So user can't get courseTaskEnrollment`));
            }

            const taskId = req.params.taskId;
            if (!ObjectId.isValid(taskId)) {
                return next(ApiError.BadRequest("Incorrect taskId"));
            }

            const task = await TaskEnrollment.findTaskById(new ObjectId(taskId));
            if (!task) {
                return next(ApiError.NotFoundError(`Can't find task with id: ${taskId}. Maybe task wasn't created`));
            }

            const taskIds: Array<ObjectId> = (await CourseEnrollment.findCourseById(new ObjectId(courseId)))?.tasks;
            const taskExists = taskIds.some(task => task.equals(new ObjectId(taskId)));
            if (!taskExists) {
                return next(ApiError.AccessForbidden(`This task not from this course. So you can't get it`));
            }

            if (!task.startedAt) {
                TaskEnrollment.updateTask({
                    _id: new ObjectId(taskId),
                    startedAt: new Date()
                });
            }

            CourseEnrollment.updateCourse({
                _id: new ObjectId(courseId),
                currentTaskId: new ObjectId(taskId)
            });
            
            return res.status(200).json(await TaskEnrollment.findTaskById(new ObjectId(taskId)));
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourseTaskTemplates(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not created this course`));
            }

            const tasks: Array<ObjectId> = course.taskTemplates;

            return res.status(200).json(await taskService.getTaskTemplatesByListOfIds(tasks));
        } catch (e) {
            return next(e);
        }
    }

    async deleteCourseTask(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete task from course he didn't create`));
            }
            
            // if other users have started enrolling the course, then refuse to change courseTemplate
            const courseExists: boolean = await courseService.checkExistenceOfCourseEnrollmentWithId(new ObjectId(courseId));
            if (courseExists) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete a courseTask while other users are enrolled in this course`));
            }

            const taskId = req.params.taskId;
            if (!ObjectId.isValid(taskId)) {
                return next(ApiError.BadRequest("Incorrect taskId"));
            }

            const task = await TaskTemplate.findTaskById(new ObjectId(taskId));
            if (!task) {
                return next(ApiError.NotFoundError(`Can't find task with id: ${taskId}. Maybe task wasn't created`));
            }

            const tasks: Array<ObjectId> = course.taskTemplates; 
            if (!tasks.some(task => task.equals(new ObjectId(taskId)))) {
                return next(ApiError.AccessForbidden(`This task not from this course. So you can't delete it`));
            }

            await CourseTemplate.removeTaskId(course._id, new ObjectId(taskId));    // to update list of tasks inside course

            const deleteResult = await TaskTemplate.deleteTaskById(new ObjectId(taskId));    // to remove from task collection in BD
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
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete tasks from course he didn't create`));
            }

            // if other users have started enrolling the course, then refuse to delete all courseTasks
            const courseExists: boolean = await courseService.checkExistenceOfCourseEnrollmentWithId(new ObjectId(courseId));
            if (courseExists) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete all courseTasks a courseTask while other users are enrolled in this course`));
            }

            const tasks: Array<ObjectId> = course.taskTemplates;
            if (tasks.length === 0) {
                return res.status(200).json({ message: "Nothing to delete. Tasks: []" })
            }

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
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't submit task in course he hasn't enrolled`));
            }

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`Course hasn't started`));
            }
    
            const taskEnrollmentId = req.params.taskId;
            if (!ObjectId.isValid(taskEnrollmentId)) {
                return next(ApiError.BadRequest("Incorrect taskId"));
            }
    
            let taskEnrollment = await TaskEnrollment.findTaskById(new ObjectId(taskEnrollmentId));
            if (!taskEnrollment) {
                return next(ApiError.NotFoundError(`Can't find taskEnrollment with id: ${taskEnrollmentId}`));
            }

            if (!taskEnrollment.startedAt) {
                return next(ApiError.AccessForbidden(`Task hasn't started`));
            }

            if (taskEnrollment.status === TaskStatusType.Completed) {
                return next(ApiError.AccessForbidden(`You can submit task only 1 time`));
            }

            let userAnswers = req.body.userAnswers;
            if (userAnswers == null) {
                userAnswers = new Array<string>;
            }

            await TaskEnrollment.updateTask({
                _id: new ObjectId(taskEnrollmentId),
                userAnswers: userAnswers
            })

            taskEnrollment = await TaskEnrollment.findTaskById(new ObjectId(taskEnrollmentId)); // updated doc
            if (!taskEnrollment) {
                return next(ApiError.NotFoundError(`Can't find taskEnrollment with id: ${taskEnrollmentId}`));
            }
    
            const taskTemplateId = taskEnrollment.taskTemplateId;
            const taskTemplate = await TaskTemplate.findTaskById(taskTemplateId);
            if (!taskTemplate) {
                return next(ApiError.NotFoundError(`Can't find taskTemplate with id: ${taskTemplateId}`));
            }
    
            const taskType: TaskType = taskEnrollment.taskType; 
        
            let trueAnswers;

            let isCorrect: boolean;
            if (taskType === 'test') {
                isCorrect = await TestQuestion.check(taskTemplateId, taskEnrollment.userAnswers);

                trueAnswers = taskTemplate.trueAnswers;
            } else if (taskType === 'fillgaps') {
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
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't get taskEnrollment from course he hasn't enrolled`));
            }

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
                
                const nextTaskEnrollment = await TaskEnrollment.findTaskById(nextTaskId);
                if (!nextTaskEnrollment) {
                    return next(ApiError.BadRequest("Can't find next task enrollment"));
                }

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
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't get taskEnrollment from course he hasn't enrolled`));
            }

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

                const prevTaskEnrollment = await TaskEnrollment.findTaskById(prevTaskId);
                if (!prevTaskEnrollment) {
                    return next(ApiError.BadRequest("Can't find prev task enrollment"));
                }

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
}

module.exports = new TaskController();