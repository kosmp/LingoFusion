/* eslint-disable @typescript-eslint/no-var-requires */
import {Document, ObjectId, WithId} from "mongodb";
import {CourseEnrollment} from "../models/courseEnrollment";
import {CourseTemplate} from "../models/courseTemplate";
const taskService = require('../services/taskService');

class CourseService {
    async getCourseTemplatesByListOfIds(courses: Array<ObjectId>) {
        const resultCourses: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();

        for (const courseId of courses) {
            const course: WithId<Document> | null = await CourseTemplate.findCourseById(courseId);
            
            if (course) {
                const taskIds: Array<ObjectId> = (await CourseTemplate.findCourseById(course!._id))?.taskTemplates;
                const tasks: Array<WithId<Document>> = await taskService.getTaskTemplatesByListOfIds(taskIds);
                course!.tasks = tasks;
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
                course!.tasks = tasks;
                resultCourses.push(course);
            }
        }

        return resultCourses;
    }

    async getCourseEnrollmentsByUserId(userId: ObjectId) : Promise<Array<WithId<Document>>> {
        const courses = await CourseEnrollment.findAllCourses();

        if (!courses) {
            throw Error(`Can't find any courses`);
        }

        const result: Array<WithId<Document>> = new Array<WithId<Document>>();

        for (const course of courses) {
            if (course.authorId != userId) {
                continue;
            }

            result.push(course);
        }

        return result;
    }
}

module.exports = new CourseService();