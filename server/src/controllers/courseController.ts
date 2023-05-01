/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
import {Request, Response, NextFunction} from 'express';
import {Course} from '../models/course';
import {RequestForCreateCourse, RequestForUpdateCourse, RequestWithUserFromMiddleware} from '../utils/types';
import {ObjectId} from 'mongodb';

class CourseController {
    async createCourse(req: RequestForCreateCourse, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const course = new Course();

            await course.initialize({
                title: req.body.title,
                description: req.body.description,
                englishLvl: req.body.englishLvl,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                tasks: new Set<ObjectId>(),
                rating: 0,
                authorId: req.user?._id
            })

            return res.status(200).json(course);
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const courses = await Course.getAllCourses();

            return res.status(200).json(courses)
        } catch (e) {
            return next(e);
        }
    }

    async getCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            if (!ObjectId.isValid(courseId)) {
                return next(ApiError.BadRequest("Incorrect courseId"));
            }

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            return res.status(200).json(course);
        } catch (e) {
            return next(e);
        }
    }

    async removeCourse(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            if (course.author != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${courseId} can't delete course he didn't create`));
            }

            const deleteResult = await Course.deleteCourseById(new ObjectId(courseId));

            if (!deleteResult) {
                return next(ApiError.NotFoundError(`Can't remove course with id: ${courseId}`));
            }

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }

    async updateCourse(req: RequestForUpdateCourse, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));

            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            if (course.author != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${courseId} can't delete course he didn't create`));
            }

            Course.updateCourse({
                _id: course._id,
                title: req.body.title,
                description: req.body.description,
                englishLvl: req.body.englishLvl,
                imageUrl: req.body.imageUrl,
                rating: req.body.rating,
                tasks: req.body.tasks,
                tags: req.body.tags
            })

            return res.status(200).json({success: true});            
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CourseController();