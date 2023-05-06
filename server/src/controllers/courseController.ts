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
            
            await User.addCourseToCreatedById(req.user?._id, courseId);

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
            const courses = await courseService.getCourseEnrollmentsByUserId(new ObjectId(req.user._id));

            return res.status(200).json(courses);
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

            const tasks: Array<ObjectId> = (await CourseTemplate.findCourseById(new ObjectId(courseId)))?.tasks;
            
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

            await User.removeCourseFromCreatedById(req.user?._id, new ObjectId(courseId));

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
    
    }

    async unEnrollFromCourse(req: Request, res: Response, next: NextFunction) {
    
    }

    async startCourse(req: Request, res: Response, next: NextFunction) {
    
    }

    async completeCourse(req: Request, res: Response, next: NextFunction) {
    
    }

    async getProgressOfCourse(req: Request, res: Response, next: NextFunction) {
    
    }
}

module.exports = new CourseController();