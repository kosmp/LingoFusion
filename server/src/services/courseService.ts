/* eslint-disable @typescript-eslint/no-var-requires */
import {Document, ObjectId, WithId} from "mongodb";
import {Course} from "../models/course";
const taskService = require('../services/taskService');

class CourseService {
    async getCoursesByListOfIds(courses: Array<ObjectId>) {
        const resultCourses: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();

        for (const courseId of courses) {
            const course: WithId<Document> | null = await Course.findCourseById(courseId);
            
            if (course) {
                const taskIds: Array<ObjectId> = await Course.get_tasksById(course!._id);
                const tasks: Array<WithId<Document>> = await taskService.getTasksByListOfIds(taskIds);
                course!.tasks = tasks;
                resultCourses.push(course);
            }
        }

        return resultCourses;
    }
}

module.exports = new CourseService();