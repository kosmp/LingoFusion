/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
import {Request, Response, NextFunction} from 'express';
import {Course} from '../models/course';
import {RequestForCreateCourse, RequestForUpdateCourse, RequestWithUserFromMiddleware} from '../utils/types';
import {ObjectId} from 'mongodb';
import {FillInGaps} from '../models/fillInGaps';
import {TestQuestion} from '../models/testQuestion';
import {Theory} from '../models/theory';
import {TaskType} from '../utils/types';


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
                tasks: [],
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

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
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

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
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

    async createTaskForCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const courseId = req.params.courseId;
            const course = await Course.findCourseById(new ObjectId(courseId));
    
            if (!course) {
                return next(ApiError.NotFoundError(`Can't find course with id: ${courseId}. Maybe course wasn't created`));
            }
    
            let task;
            if (req.body.taskType === TaskType.FillGaps) {
                task = new FillInGaps();
                await task.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    options: req.body.options,
                    correctAnswers: req.body.correctAnswers,
                    expForTrueAnswers: req.body.expForTrueAnswers
                });
                } else if (req.body.taskType === TaskType.Test) {
                task = new TestQuestion();
                await task.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    question: req.body.question,
                    trueAnswers: req.body.trueAnswers,
                    receivedAnswers: req.body.receivedAnswers,
                    expForTrueTask: req.body.expForTrueTask 
                });
            } else if (req.body.taskType === TaskType.Theory) {
                task = new Theory();
                await task.initialize({
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    references: req.body.references,
                    images: req.body.imagesUrl,
                    expForTheory: req.body.expForTheory
                });
            } else {
                console.log(req.body.taskType);
                return next(ApiError.BadRequest(`Invalid task type: ${req.body.taskType}`))
            }
    
            Course.addTaskById(new ObjectId(courseId), await task.get_id());
    
            return res.status(200).json({
                success: true,
                taskId: await task.get_id(),
                taskType: req.body.taskType
            });
        } catch (e) {
            next(e);
        }
    }
    
}

module.exports = new CourseController();