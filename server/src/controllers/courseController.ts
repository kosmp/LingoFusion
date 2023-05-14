import {Request, Response, NextFunction} from 'express';
import {CourseEnrollment} from '../models/courseEnrollment';
import {CourseTemplate} from '../models/courseTemplate';
import {RequestForCreateCourseTemplate, RequestForUpdateCourse, RequestWithUserFromMiddleware} from '../utils/types';
import {Document, ObjectId, WithId} from 'mongodb';
import {TaskTemplate} from '../models/taskTemplate';
import {TaskEnrollment} from '../models/taskEnrollment';
import {User} from '../models/user';
import {CourseStatusType, TaskStatusType, UserCourseProperty} from '../utils/enums';
import {Profile} from '../models/profile';
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/apiError');
const profileService = require('../services/profileService');
const courseService = require('../services/courseService');
const userService = require('../services/userService');
const taskService = require('../services/taskService');

class CourseController {
    async createCourse(req: RequestForCreateCourseTemplate, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const userId: ObjectId = req.user._id;
            const user = await userService.getUser(userId.toString());

            const profile = await profileService.getUserProfile(userId.toString());

            const courseId: ObjectId = await CourseTemplate.initialize({
                title: req.body.title,
                description: req.body.description,
                englishLvl: req.body.englishLvl,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                taskTemplates: [],
                rating: 0,
                numberOfRatings: 0,
                authorId: userId,
                numberOfCompletedCourses: 0
            });

            await Profile.updateProfile({
                _id: user.profile_id,
                statistics: {
                    totalUserCountOfCompletedCourses: profile.statistics.totalUserCountOfCompletedCourses,
                    totalUserCountInProgressCourses: profile.statistics.totalUserCountInProgressCourses,
                    totalUserCountOfCreatedCourses: profile.statistics.totalUserCountOfCreatedCourses + 1
                }
            });
            
            await User.addCourseToUserById(req.user._id, courseId, UserCourseProperty.CreatedCourses);

            return res.status(200).json(await courseService.getCourseTemplate(courseId.toString()));
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
            const userId: ObjectId = req.user._id;
            const user = await userService.getUser(userId.toString());

            const courseEnrollments: Array<ObjectId> = user.courseEnrollments;
            const result = await courseService.getCourseEnrollmentsByListOfIds(courseEnrollments);

            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async getAllCourseTemplatesOfUser(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId: ObjectId = req.user._id;
            const user = await userService.getUser(userId.toString());

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
            const course = await courseService.getCourseTemplate(courseId);

            const result = await courseService.getCourseTemplatesByListOfIds([course._id]);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async getCourseEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseEnrollmentId;
            const course = await courseService.getCourseEnrollment(courseId);

            const result = await courseService.getCourseEnrollmentsByListOfIds([course._id]);
            return res.status(200).json(result);
        } catch (e) {
            return next(e);
        }
    }

    async removeCourseTemplate(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const courseId = req.params.courseId;
            const course = await courseService.getCourseTemplate(courseId);

            const userId: ObjectId = req.user._id;
            await userService.getUser(userId.toString());

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
            }

            await courseService.checkExistenceOfCourseEnrollmentForCourseTemplate(courseId);

            const tasks: Array<ObjectId> = course.taskTemplates;            
            for(const task of tasks) {
                const deleteResult = await TaskTemplate.deleteTaskById(new ObjectId(task));
                if (!deleteResult) {
                    return next(ApiError.NotFoundError(`Can't remove task with id: ${task}`));
                }
            }

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
            const course = await courseService.getCourseTemplate(courseId);

            const userId: ObjectId = req.user._id;
            await userService.getUser(userId.toString());

            if (course.authorId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} can't delete course he didn't create`));
            }

            await courseService.checkExistenceOfCourseEnrollmentForCourseTemplate(courseId);

            await CourseTemplate.updateCourse({
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
            const course = await courseService.getCourseTemplate(courseId);

            const userId: ObjectId = req.user._id;
            const user = await userService.getUser(userId.toString());

            const courseEnrollmentsWithUserId = await CourseEnrollment.findCoursesByUserId(req.user._id);
            if (courseEnrollmentsWithUserId.some((courseEnrollment) => courseEnrollment.coursePresentationId.equals(new ObjectId(courseId)))) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} is already enrolling the course`));
            }

            const taskTemplates: Array<ObjectId> = course.taskTemplates
            const tasks: Array<ObjectId> = new Array<ObjectId>;
            let maxExpForTrueTasks = 0;

            for (const taskTemplateId of taskTemplates) {
                const taskTemplate = await taskService.getTaskTemplate(taskTemplateId.toString());

                maxExpForTrueTasks += taskTemplate.expForTrueTask

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
                userId: req.user._id,
                maxPossibleExpAmount: maxExpForTrueTasks,
                ratingForCourse: null
            });

            const result = await courseService.getCourseEnrollment(courseEnrollmentId.toString());

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
            const course = await courseService.getCourseEnrollment(courseId);

            const userId: ObjectId = req.user._id;
            await userService.getUser(userId.toString());
    
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
            const course = await courseService.getCourseEnrollment(courseId);

            const userId: ObjectId = req.user._id;
            const user = await userService.getUser(userId.toString());
    
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

            const profile = await profileService.getUserProfile(userId.toString());

            await Profile.updateProfile({
                _id: user.profile_id,
                statistics: {
                    totalUserCountOfCompletedCourses: profile.statistics.totalUserCountOfCompletedCourses,
                    totalUserCountInProgressCourses: profile.statistics.totalUserCountInProgressCourses + 1,
                    totalUserCountOfCreatedCourses: profile.statistics.totalUserCountOfCreatedCourses
                }
            });
    
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
            const course = await courseService.getCourseEnrollment(courseId);

            const courseTemplateId = course.coursePresentationId;
            const courseTemplate = await courseService.getCourseTemplate(courseTemplateId.toString());

            const userId: ObjectId = req.user._id;
            const user = await userService.getUser(userId.toString());
    
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
                const task = await taskService.getTaskEnrollment(taskId.toString());
    
                if (task.status == TaskStatusType.InProgress) {
                    return next(ApiError.AccessForbidden(`You can complete course only with all completed tasks`));
                }
            }

            const profile = await profileService.getUserProfile(userId.toString());

            await Profile.updateProfile({
                _id: user.profile_id,
                statistics: {
                    totalUserCountOfCompletedCourses: profile.statistics.totalUserCountOfCompletedCourses + 1,
                    totalUserCountInProgressCourses: profile.statistics.totalUserCountInProgressCourses - 1,
                    totalUserCountOfCreatedCourses: profile.statistics.totalUserCountOfCreatedCourses
                }
            });
    
            const statistics = await courseService.calculateCourseStatistics(new ObjectId(courseId));
    
            await CourseEnrollment.updateCourse({
                _id: course._id,
                status: CourseStatusType.Completed,
                completedAt: new Date(),
                statistics: statistics
            });

            await CourseTemplate.updateCourse({
                _id: courseTemplateId,
                numberOfCompletedCourses: courseTemplate.numberOfCompletedCourses + 1
            });
    
            return res.status(200).json({
                success: true,
                statistics: statistics
            });
        } catch(e) {
            return next(e);
        }
    }

    async updateCourseRating(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const rating: number = req.body.rating;

            const courseId = req.params.courseEnrollmentId;
            const course = await courseService.getCourseEnrollment(courseId);

            const userId: ObjectId = req.user._id;
            await userService.getUser(userId.toString());
    
            if (course.userId != req.user._id) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not enrolled in this course`));
            }

            if (!course.startedAt) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not started this courseEnrollment`));
            }

            if (!course.completedAt) {
                return next(ApiError.AccessForbidden(`User with id: ${req.user._id} has not completed this course to set rating`));
            }

            const courseTemplateId: ObjectId = course.coursePresentationId;
            let courseTemplate = await courseService.getCourseTemplate(courseTemplateId.toString());
            if (!courseTemplate.rating) {
                await CourseTemplate.updateCourse({
                    _id: courseTemplateId,
                    rating: 0,
                    numberOfRatings: 0
                });

                courseTemplate = await courseService.getCourseTemplate(courseTemplateId.toString());
            }

            const oldNumberOfRatings: number = courseTemplate.numberOfRatings;
            let newNumberOfRatings: number = oldNumberOfRatings;
            let newCourseTemplateRating: number;

            if (!course.ratingForCourse) {
                ++newNumberOfRatings;
                newCourseTemplateRating = (courseTemplate.rating * oldNumberOfRatings + rating) / newNumberOfRatings;
            } else {
                newCourseTemplateRating = (courseTemplate.rating * oldNumberOfRatings - course.ratingForCourse + rating) / newNumberOfRatings;
            }

            await CourseEnrollment.updateCourse({
                _id: new ObjectId(courseId),
                ratingForCourse: rating
            });

            await CourseTemplate.updateCourse({
                _id: courseTemplateId,
                rating: newCourseTemplateRating,
                numberOfRatings: newNumberOfRatings
            });

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new CourseController();