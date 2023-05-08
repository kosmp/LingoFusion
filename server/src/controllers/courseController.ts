/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
const courseService = require('../services/courseService');
import {Request, Response, NextFunction} from 'express';
import {CourseEnrollment} from '../models/courseEnrollment';
import {CourseTemplate} from '../models/courseTemplate';
import {RequestForCreateCourseTemplate, RequestForUpdateCourse, RequestWithUserFromMiddleware} from '../utils/types';
import {ObjectId} from 'mongodb';
import {TaskTemplate} from '../models/taskTemplate';
import {TaskEnrollment} from '../models/taskEnrollment';
import {User} from '../models/user';
import {StatusType, TaskType, UserCourseProperty} from '../utils/enums';


class CourseController {
    async createCourse(req: RequestForCreateCourseTemplate, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId: ObjectId = await CourseTemplate.initialize({
                title: req.body.title,
                description: req.body.description,
                englishLvl: req.body.englishLvl,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                taskTemplates: [],
                rating: 0,
                authorId: req.user?._id
            })
            
            await User.addCourseToUserById(req.user?._id, courseId, UserCourseProperty.CreatedCourses);

            return res.status(200).json(await CourseTemplate.findCourseById(courseId));
        } catch (e) {
            return next(e);
        }
    }

    async getAllAvailableCourses(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courses = [...(await CourseTemplate.findAllCourses()), ...(await courseService.getCourseEnrollmentsByUserId(new ObjectId(req.user._id)))];

            return res.status(200).json(courses);
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourseTemplates(req: Request, res: Response, next: NextFunction) {
        try {
            const courses = await CourseTemplate.findAllCourses();
            
            return res.status(200).json(courses);
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourseEnrollmentsOfUser(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            if (!ObjectId.isValid(userId)) {
                return next(ApiError.BadRequest("Incorrect userId"));
            }

            const user = await User.findOneUserById(new ObjectId(userId));
    
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${userId}`));
            }

            const courseEnrollments: Array<ObjectId> = user.courseEnrollments;

            const result = await courseService.getCourseEnrollmentsByListOfIds(courseEnrollments);

            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async getUserCreatedCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            if (!ObjectId.isValid(userId)) {
                return next(ApiError.BadRequest("Incorrect userId"));
            }

            const user = await User.findOneUserById(new ObjectId(userId));
    
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${userId}`));
            }

            const createdCourses: Array<ObjectId> = user.createdCourses;

            const result = await courseService.getCourseTemplatesByListOfIds(createdCourses);

            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async getCourseTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const result = await courseService.getCoursesByListOfIds([course._id]);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async getCourseEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const result = await courseService.getCoursesByListOfIds([course._id]);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async removeCourseTemplate(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
            }

            const tasks: Array<ObjectId> = course?.taskTemplates;
            
            tasks.forEach(async task => {
                const deleteResult = await TaskTemplate.deleteTaskById(new ObjectId(task));
                
                if (!deleteResult) {
                    return next(ApiError.NotFoundError(`Can't remove task with id: ${task}`));
                }
            });

            const deleteResult = await CourseTemplate.deleteCourseById(new ObjectId(courseId));

            if (!deleteResult) {
                return next(ApiError.NotFoundError(`Can't remove course with id: ${courseId}`));
            }

            await User.removeCourseFromUserById(req.user?._id, new ObjectId(courseId), UserCourseProperty.CreatedCourses);

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }

    async updateCourseTemplate(req: RequestForUpdateCourse, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId = req.params.courseId;

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));

            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
            }

            CourseTemplate.updateCourse({
                _id: course._id,
                title: req.body.title,
                description: req.body.description,
                englishLvl: req.body.englishLvl,
                imageUrl: req.body.imageUrl,
                rating: req.body.rating,
                tags: req.body.tags
            })

            return res.status(200).json({success: true});            
        } catch (e) {
            return next(e);
        }
    }

    async enrollInCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find courseTemplate with id: ${courseId}`));
            }

            const taskTemplates: Array<ObjectId> = course.taskTemplates;
            
            const tasks: Array<ObjectId> = new Array<ObjectId>;
            
            for (const taskTemplateId of taskTemplates) {
                const taskTemplate = await TaskTemplate.findTaskById(taskTemplateId);

                if (!taskTemplate) {
                    return next(ApiError.NotFoundError(`Can't find taskTemplate with id: ${taskTemplateId}`));
                }

                const task = await TaskEnrollment.initialize({
                    taskTemplateId: taskTemplate._id,
                    taskType: taskTemplate.taskType,
                    status: StatusType.InProgress,
                    title: taskTemplate.title,
                    description: taskTemplate.description,
                    expForTask: 0,
                    startedAt: null,
                    completedAt: null,
                    userAnswers: null
                });

                tasks.push(task);
            }

            const courseEnrollmentId: ObjectId = await CourseEnrollment.initialize({
                coursePresentationId: course._id,
                title: course.title,
                status: StatusType.InProgress,
                currentTaskId: null,
                startedAt: new Date(),
                completedAt: null,
                tasks: tasks,
                authorId: course.authorId
            })

            const result = await CourseEnrollment.findCourseById(courseEnrollmentId);

            if (!result) {
                return next(ApiError.BadRequest("Error when enrolling in a course"))
            }

            return res.status(200).json({
                success: true,
                result: result
            });
        } catch (e) {
            return next(e);
        }
    }

    async unEnrollFromCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        const courseId = req.params.courseId;

        const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
        
        if (!course) {
            return next(ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}`));
        }

        if (course.authorId != req.user._id) {
            return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
        }

        const tasks: Array<ObjectId> = course?.tasks;
            
        tasks.forEach(async task => {
            const deleteResult = await TaskEnrollment.deleteTaskById(new ObjectId(task));
            
            if (!deleteResult) {
                return next(ApiError.NotFoundError(`Can't remove taskEnrollment with id: ${task}`));
            }
        });

        const deleteResult = await CourseEnrollment.deleteCourseById(new ObjectId(courseId));

        if (!deleteResult) {
            return next(ApiError.NotFoundError(`Can't remove courseEnrollment with id: ${courseId}`));
        }

        await User.removeCourseFromUserById(req.user?._id, new ObjectId(courseId), UserCourseProperty.CourseEnrollments);
        
        return res.status(200).json({success: true});
    }

    async startCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        const courseId = req.params.courseId;

        const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));

        if (!course) {
            return next(ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}`));
        }

        if (course.authorId != req.user._id) {
            return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
        }

        if (!course.currentTaskId) {
            return next(ApiError.BadRequest(`CourseEnrollment with id ${courseId} already started`));
        }

        if (!course.tasks) {
            return next(ApiError.BadRequest(`CourseEnrollment with id ${courseId} hasn't any taskEnrollments`));
        }

        const firstTaskEnrollmentId = course.tasks[0]._id;

        await CourseEnrollment.updateCourse({
            _id: new ObjectId(courseId),
            currentTaskId: firstTaskEnrollmentId,
            startedAt: new Date()
        })
        
        const result = await courseService.getCourseEnrollmentsByListOfIds([new ObjectId(courseId)]);

        if (!result) {
            return next(ApiError.BadRequest("Can't get getCourseEnrollmentsByListOfIds"));
        }

        return res.status(200).json({
            success: true,
            result: result
        });
    }

    async completeCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        const courseId = req.params.courseId;

        const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));

        if (!course) {
            return next(ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}`));
        }

        if (course.authorId != req.user._id) {
            return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
        }

        const taskIds: Array<ObjectId> = course?.tasks;
            
        taskIds.forEach(async taskId => {
            const task = await TaskEnrollment.findTaskById(taskId);

            if (!task) {
                return next(ApiError.BadRequest("Can't get taskEnrollment"));
            }

            if (task.status == StatusType.InProgress) {
                return next(ApiError.AccessForbidden(`You can complete course only with all completed tasks`));
            }
        });

        course.status = StatusType.Completed;

        const statistics = courseService.calculateCourseCompletionStatistics(new ObjectId(courseId), req.user._id);

        return res.status(200).json({
            success: true,
            statistics: statistics
        });
    }

    async getProgressOfCourse(req: Request, res: Response, next: NextFunction) {
    
    }
}

module.exports = new CourseController();