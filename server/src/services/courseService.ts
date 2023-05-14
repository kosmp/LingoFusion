import {Document, ObjectId, WithId} from "mongodb";
import {CourseEnrollment} from "../models/courseEnrollment";
import {CourseTemplate} from "../models/courseTemplate";
import {TaskEnrollment} from "../models/taskEnrollment";
import {CourseStatistics} from "../utils/types";
import {EnglishLvl} from "../utils/enums";
const taskService = require('../services/taskService');
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

    async calculateCourseStatistics(courseId: ObjectId) : Promise<CourseStatistics>{
        const courseEnrollment = await this.getCourseEnrollment(courseId.toString());

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

    async getCourseTemplate(courseId: string) : Promise<WithId<Document>>{
        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseTemplateId");
        }

        const course = await CourseTemplate.findCourseById(new ObjectId(courseId));
        if (!course) {
            throw ApiError.NotFoundError(`Can't find courseTemplate with id: ${courseId}. Maybe course wasn't created`);
        }

        return course;
    }

    async getCourseEnrollment(courseId: string) : Promise<WithId<Document>>{
        if (!ObjectId.isValid(courseId)) {
            throw ApiError.BadRequest("Incorrect courseEnrollmentId");
        }

        const course = await CourseEnrollment.findCourseById(new ObjectId(courseId));
        if (!course) {
            throw ApiError.NotFoundError(`Can't find courseEnrollment with id: ${courseId}. Maybe course wasn't created`);
        }

        return course;
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

    async getRatedCourseTemplates(ratingThreshold: string) {
        const pipeline = [
            {
              $match: { rating: { $ne: null, $gt: Number(ratingThreshold) } }
            },
            {
              $sort: { rating: -1 }
            }
        ];
        
        const result = await CourseTemplate.getFilteredCourses(pipeline);
        return result;
    }

    async getCourseTemplatesByEnglishLvl(englishLvl: EnglishLvl) {
        const pipeline = [
            {
                $match: { englishLvl: { $eq: englishLvl } }
            }
        ];
        
        const result = await CourseTemplate.getFilteredCourses(pipeline);
        return result;
    }

    async getCourseTemplatesByTag(tag: string) {
        const pipeline = { tags: { $in: [tag] } };

          const result = await CourseTemplate.findAllCourses(pipeline);
          return result;
    }
}

module.exports = new CourseService();