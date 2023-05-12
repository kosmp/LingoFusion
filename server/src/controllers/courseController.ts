/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
const courseService = require('../services/courseService');
import {Request, Response, NextFunction} from 'express';
import {CourseEnrollment} from '../models/courseEnrollment';
import {CourseTemplate} from '../models/courseTemplate';
import {RequestForCreateCourseTemplate, RequestForUpdateCourse, RequestWithUserFromMiddleware} from '../utils/types';
import {Document, ObjectId, WithId} from 'mongodb';
import {TaskTemplate} from '../models/taskTemplate';
import {TaskEnrollment} from '../models/taskEnrollment';
import {User} from '../models/user';
import {CourseStatusType, TaskStatusType, UserCourseProperty} from '../utils/enums';


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
            const courseEnrollments = await CourseEnrollment.findAllCourses();
            if (!courseEnrollments) {
                return next(ApiError.NotFoundError(`Can't find any courses`));
            }
    
            const result: Array<WithId<Document>> = new Array<WithId<Document>>();
            const userId = new ObjectId(req.user._id)

            for (const course of courseEnrollments) {
                if (!(new ObjectId(course.userId)).equals(userId)) {
                    continue;
                }

                result.push(course);
            }

            const resultCourses = [...(await CourseTemplate.findAllCourses()), ...(result)];

            return res.status(200).json(resultCourses);
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
            const userId = req.user._id;

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

    async getAllCourseTemplatesOfUser(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId = req.user._id;

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

            const result = await courseService.getCourseTemplatesByListOfIds([course._id]);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async getCourseEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseEnrollmentId"));
            }

            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            const result = await courseService.getCourseEnrollmentsByListOfIds([course._id]);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async removeCourseTemplate(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
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
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
            }

            // if other users have started enrolling the course, then refuse to delete courseTemplate
            if (await courseService.checkExistenceOfCourseEnrollmentWithId(courseId)) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete a course while other users are subscribed to it`));
            }

            const tasks: Array<ObjectId> = course.taskTemplates;
            
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
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
            }

            // if other users have started enrolling the course, then refuse to update courseTemplate
            const courseExists: boolean = await courseService.checkExistenceOfCourseEnrollmentWithId(courseId);
            if (courseExists) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can not change a course that is already being enrolled`));
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

    async enrollInCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find courseTemplate with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }

            const courseEnrollmentsWithUserId = await CourseEnrollment.findCoursesByUserId(req.user._id);
            if (courseEnrollmentsWithUserId.some((courseEnrollment) => courseEnrollment.coursePresentationId.equals(new ObjectId(courseId)))) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} is already enrolling the course`));
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
                    status: TaskStatusType.InProgress,
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
                status: CourseStatusType.InProgress,
                currentTaskId: null,
                startedAt: null,
                completedAt: null,
                tasks: tasks,
                statistics: {
                    resultExp: 0,
                    counterOfTrueTasks: 0
                },
                userId: req.user._id
            });

            const result = await CourseEnrollment.findCourseById(courseEnrollmentId);

            await User.findUserByIdAndUpdate(req.user._id, {courseEnrollments: [...user.courseEnrollments, courseEnrollmentId]});

            return res.status(200).json({
                success: true,
                result: result
            });
        } catch (e) {
            return next(e);
        }
    }

    async unEnrollFromCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseEnrollmentId"));
            }
    
            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
            }

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not started this courseEnrollment`));
            }

            if (!course.completedAt) {
                return next(ApiError.AccessForbidden(`CourseEnrollment hasn't completed`));
            }
    
            const tasks: Array<ObjectId> = course.tasks;
            for (const task of tasks) {
                const deleteResult = await TaskEnrollment.deleteTaskById(new ObjectId(task));
                if (!deleteResult) {
                    return next(ApiError.NotFoundError(`Can't remove taskEnrollment with id: ${task}`));
                }
            }
    
            const deleteResult = await CourseEnrollment.deleteCourseById(new ObjectId(courseId));
            if (!deleteResult) {
                return next(ApiError.NotFoundError(`Can't remove courseEnrollment with id: ${courseId}`));
            }
    
            await User.removeCourseFromUserById(req.user?._id, new ObjectId(courseId), UserCourseProperty.CourseEnrollments);
            
            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }

    async startCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseEnrollmentId"));
            }
    
            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
            }

            if (course.startedAt) {
                return next(ApiError.BadRequest(`CourseEnrollment with id ${courseId} already started`));
            }

            if (!(course.tasks) || course.tasks.length == 0) {
                return next(ApiError.BadRequest(`CourseEnrollment with id ${courseId} hasn't any taskEnrollments`));
            }
    
            const firstTaskId: ObjectId = course.tasks[0];

            await CourseEnrollment.updateCourse({
                _id: new ObjectId(courseId),
                currentTaskId: firstTaskId,
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
        } catch(e) {
            return next(e);
        }
    }

    async completeCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseEnrollmentId;
            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }
    
            const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}`));
            }

            const user = await User.findOneUserById(req.user._id);
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${req.user._id}`));
            }
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
            }

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not started this courseEnrollment`));
            }

            if (course.completedAt) {
                return next(ApiError.AccessForbidden(`CourseEnrollment with id: ${courseId} has already completed`));
            }
    
            const taskIds: Array<ObjectId> = course.tasks;
            for(const taskId of taskIds) {
                const task = await TaskEnrollment.findTaskById(taskId);
                if (!task) {
                    return next(ApiError.BadRequest(`Can't get taskEnrollment with id ${taskId}`));
                }
    
                if (task.status == TaskStatusType.InProgress) {
                    return next(ApiError.AccessForbidden(`You can complete course only with all completed tasks`));
                }
            }
    
            const statistics = await courseService.calculateCourseStatistics(new ObjectId(courseId));
    
            await CourseEnrollment.updateCourse({
                _id: course._id,
                status: CourseStatusType.Completed,
                completedAt: new Date(),
                statistics: statistics
            });
    
            return res.status(200).json({
                success: true,
                statistics: statistics
            });
        } catch(e) {
            return next(e);
        }
    }
}

module.exports = new CourseController();