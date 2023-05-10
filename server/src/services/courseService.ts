/* eslint-disable @typescript-eslint/no-var-requires */
import {Document, ObjectId, WithId} from "mongodb";
import {CourseEnrollment} from "../models/courseEnrollment";
import {CourseTemplate} from "../models/courseTemplate";
import { TaskEnrollment } from "../models/taskEnrollment";
const taskService = require('../services/taskService');

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

    async checkExistenceOfCourseEnrollmentWithId(courseTemplateId: ObjectId) {
        const allCourseEnrollments = await CourseEnrollment.findAllCourses();

        for (const course of allCourseEnrollments) {
            if (course.coursePresentationId.equals(courseTemplateId)) {
              return true;
            }
        }

        return false;
    }

    async calculateCourseStatistics(courseId: ObjectId) {
        const courseEnrollment = await CourseEnrollment.findCourseById(courseId);

        const courseEnrollmentTasks: Array<ObjectId> = courseEnrollment?.tasks;
        
        let resultExp = 0;
        let counterOfTrueTasks = 0;
        courseEnrollmentTasks.forEach(async (taskId) => {
            const task = await TaskEnrollment.findTaskById(taskId);

            if (task?.expForTrueTask != 0) {
                ++counterOfTrueTasks;
            }

            resultExp += task?.expForTask;
        });

        return {
            resultExp: resultExp,
            counterOfTrueTasks: counterOfTrueTasks
        }
    }
}

module.exports = new CourseService();