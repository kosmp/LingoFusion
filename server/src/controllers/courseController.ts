/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
import {Response, NextFunction} from 'express';
import {Course} from '../models/course';
import {RequestWithUser} from '../utils/types';
import {ObjectId} from 'mongodb';

class CourseController {
    async createCourse(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const course = new Course();

            await course.initialize({
                title: req.body.title,
                description: req.body.description,
                englishLvl: req.body.englishLvl,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                tasks: new Set<ObjectId>(),
                rating: 0,
                authorId: req.user._id
            })

            return res.status(200).json(course);
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourses(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const courses = await Course.getAllCourses();

            return res.status(200).json(courses)
        } catch (e) {
            return next(e);
        }
    }

    async getCourse(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            return res.status(200).json(course);
        } catch (e) {
            return next(e);
        }
    }

    async removeCourse(req: RequestWithUser, res: Response, next: NextFunction) {
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

    async updateCourse(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;

            const course = await Course.findCourseById(new ObjectId(courseId));
            
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}`));
            }

            if (course.author != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${courseId} can't delete course he didn't create`));
            }

            

            
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CourseController();