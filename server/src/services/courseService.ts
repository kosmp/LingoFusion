import {Document, ObjectId, WithId} from "mongodb";
import {CourseEnrollment} from "../models/courseEnrollment";
import {CourseTemplate} from "../models/courseTemplate";
import {TaskEnrollment} from "../models/taskEnrollment";
import {CourseStatistics} from "../utils/types";
import {EnglishLvl} from "../utils/enums";
const taskService = require('../services/taskService');
const userService = require('../services/userService');
const ApiError = require('../exceptions/apiError');

class CourseService {
    async getCourseTemplatesByListOfIds(courses: Array<ObjectId>) {
        const resultCourses: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();

        for (const courseId of courses) {
            const course: WithId<Document> | null = await CourseTemplate.findCourseById(courseId);
            if (course) {
                const taskIds: Array<ObjectId> = (await CourseTemplate.findCourseById(course!._id))?.taskTemplates;
                const tasks: Array<WithId<Document>> = await taskService.getTaskTemplatesByListOfIds(taskIds);
                course.taskTemplates = tasks;
                resultCourses.push(course);
            }
        }

        return resultCourses;
    }

    async getCourseEnrollmentsByListOfIds(courses: Array<ObjectId>) {
        const resultCourses: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();

        for (const courseId of courses) {
            const course: WithId<Document> | null = await CourseEnrollment.findCourseById(courseId);
            if (course) {
                const taskIds: Array<ObjectId> = (await CourseEnrollment.findCourseById(course!._id))?.tasks;
                const tasks: Array<WithId<Document>> = await taskService.getTaskEnrollmentsByListOfIds(taskIds);
                course.tasks = tasks;
                resultCourses.push(course);
            }
        }

        return resultCourses;
    }

    async checkExistenceOfCourseEnrollmentWithId(courseTemplateId: ObjectId) : Promise<boolean>{
        const allCourseEnrollments = await CourseEnrollment.findAllCourses();
        for (const course of allCourseEnrollments) {
            if (course.coursePresentationId.equals(courseTemplateId)) {
              return true;
            }
        }

        return false;
    }

    async calculateCourseStatistics(courseId: string, userId: string) : Promise<CourseStatistics>{
        const courseEnrollment = await this.getCourseEnrollment(courseId, userId);

        const courseEnrollmentTasks: Array<ObjectId> = courseEnrollment.tasks;
        let resultExp = 0;
        let counterOfTrueTasks = 0;
        for(const taskId of courseEnrollmentTasks) {
            const taskEnrollment = await TaskEnrollment.findTaskById(taskId);
            if (taskEnrollment?.expForTask != 0) {
                ++counterOfTrueTasks;
            }
            
            resultExp += taskEnrollment?.expForTask;
        }

        return {
            resultExp: resultExp,
            counterOfTrueTasks: counterOfTrueTasks
        };
    }

    /**
    * Function to check user access to the course template. Throws an error if there is no access.
    * @public_courses can be accessed by everyone
    * @non-public_courses can only be accessed by creators
    */
    async checkUserAccessTrueToCourseTemplate(courseId: string, courseAuthorId: string, userId: string) : Promise<void>{
        if (!(await this.isCourseTemplatePublic(courseId))) {
            if (courseAuthorId != userId) {
                throw ApiError.AccessForbidden(`User with id: ${userId} can't get course he didn't create. Course isn't public`);
            }
        }
    }

    /**
    * Function to get courseTemplate. Throws an error if the user does not have access to get.
    * @public_courses can be accessed by everyone
    * @non-public_courses can only be accessed by creators
    */
    async getCourseTemplate(courseId: string, userId: string) : Promise<WithId<Document>>{
        await userService.getUser(userId);

        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseTemplateId");
        }
        
        const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
        if (!course) {
            throw ApiError.NotFoundError(`Can't find courseTemplate with id: ${courseId}. Maybe course wasn't created`);
        }

        await this.checkUserAccessTrueToCourseTemplate(courseId, course.authorId, userId);

        return course;
    }

    async getCourseEnrollment(courseId: string, userId: string) : Promise<WithId<Document>>{
        await userService.getUser(userId);

        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseEnrollmentId");
        }

        const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
        if (!course) {
            throw ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}. Maybe course wasn't created`);
        }

        await this.checkPublicTrueInCourseTemplate(course.coursePresentationId.toString());

        if (course.userId.toString() != userId) {
            throw ApiError.AccessForbidden(`User with id: ${userId} has not enrolled in this course`);
        }

        return course;
    }

    async getAllPublicCourseTemplates() {
        const courses = await CourseTemplate.findAllCourses();

        const publicCourses = new Array<ObjectId>;
        for (const course of courses) {
            if (course.public === true) {
                publicCourses.push(course._id);
            } 
        }

        const result = await this.getCourseTemplatesByListOfIds(publicCourses);

        return result;
    }

    async getUserCourseEnrollments(userId: string) {
        const user = await userService.getUser(userId);

        const courseEnrollments: Array<ObjectId> = user.courseEnrollments;
        const result = await this.getCourseEnrollmentsByListOfIds(courseEnrollments);

        return result;
    }

    async getUserCreatedCourseTemplates(userId: string) {
        const user = await userService.getUser(userId);

        const createdCourses: Array<ObjectId> = user.createdCourses;
        const result = await this.getCourseTemplatesByListOfIds(createdCourses);

        return result;
    }

    async checkExistenceOfCourseEnrollmentForCourseTemplate(courseId: string) : Promise<boolean>{
        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseId");
        }

        const exists: boolean = await this.checkExistenceOfCourseEnrollmentWithId(new ObjectId(courseId));
        if (exists) {
            throw ApiError.AccessForbidden(`User who created the course can't modify templates while other users are enrolled in this course`);
        }

        return exists;
    }

    async isCourseTemplatePublic(courseId: string) : Promise<boolean>{
        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseId");
        }

        const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
        if (!course) {
            throw ApiError.NotFoundError(`Can't find courseTemplate with id: ${courseId}. Maybe course wasn't created`);
        }

        return course.public;
    }

    /**
    * Function to check field 'public' in courseTemplate. Throws an error if public: false.
    */
    async checkPublicTrueInCourseTemplate(courseId: string) : Promise<void>{
        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseId");
        }

        if (!(await this.isCourseTemplatePublic(courseId))) {
            throw ApiError.AccessForbidden('This courseTemplate is not public.');
        }
    }

    /**
    * Function to check field 'public' in courseTemplate. Throws an error if public: true.
    */
        async checkPublicFalseInCourseTemplate(courseId: string) : Promise<void>{
            if (!ObjectId.isValid(courseId)) {
                throw ApiError.BadRequest("Incorrect courseId");
            }
    
            if (await this.isCourseTemplatePublic(courseId)) {
                throw ApiError.AccessForbidden('This courseTemplate is public.');
            }
        }

    /**
    * Function to get courseTemplates with a rating value greater than a given one. Only public courseTemplates.
    */
    async getRatedCourseTemplates(ratingThreshold: string) {
        const pipeline = [
            {
              $match: { public: true, rating: { $ne: null, $gte: Number(ratingThreshold) } }
            },
            {
              $sort: { rating: -1 }
            }
        ];
        
        const result = await CourseTemplate.getFilteredCourses(pipeline);
        return result;
    }

    /**
    * Function to get courseTemplates by englishLvl. Only public courseTemplates.
    */
    async getCourseTemplatesByEnglishLvl(englishLvl: EnglishLvl) {
        const pipeline = [
            {
                $match: { public: true, englishLvl: { $eq: englishLvl } }
            }
        ];
        
        const result = await CourseTemplate.getFilteredCourses(pipeline);
        return result;
    }

    /**
    * Function to get courseTemplates by tag. Only public courseTemplates.
    */
    async getCourseTemplatesByTag(tag: string) {
        const pipeline = { public: true, tags: { $in: [tag] } };

          const result = await CourseTemplate.findAllCourses(pipeline);
          return result;
    }
}

module.exports = new CourseService();