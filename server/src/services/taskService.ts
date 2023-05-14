import {Document, ObjectId, WithId} from "mongodb";
import {TaskTemplate} from "../models/taskTemplate";
import {TaskEnrollment} from "../models/taskEnrollment";
const ApiError = require('../exceptions/apiError');

class TaskService {
    async getTaskTemplatesByListOfIds(tasks: Array<ObjectId>) {
        const resultTasks: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();
        
        for (const taskId of tasks) {
            const task: WithId<Document> | null = await TaskTemplate.findTaskById(taskId);

            if (task) {
                resultTasks.push(task);
            }
        }
        return resultTasks;
    }

    async getTaskEnrollmentsByListOfIds(tasks: Array<ObjectId>) {
        const resultTasks: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();
        
        for (const taskId of tasks) {
            const task: WithId<Document> | null = await TaskEnrollment.findTaskById(taskId);

            if (task) {
                resultTasks.push(task);
            }
        }
        return resultTasks;
    }

    async getTaskTemplate(taskId: string) : Promise<WithId<Document>>{
        if (!ObjectId.isValid(taskId)) {
            throw ApiError.BadRequest("Incorrect taskTemplateId");
        }

        const task = await TaskTemplate.findTaskById(new ObjectId(taskId));
        if (!task) {
            throw ApiError.NotFoundError(`Can't find taskTemplate with id: ${taskId}. Maybe task wasn't created`);
        }

        return task;
    }

    async getTaskEnrollment(taskId: string) : Promise<WithId<Document>>{
        if (!ObjectId.isValid(taskId)) {
            throw ApiError.BadRequest("Incorrect taskEnrollmentId");
        }

        const task = await TaskEnrollment.findTaskById(new ObjectId(taskId));
        if (!task) {
            throw ApiError.NotFoundError(`Can't find taskEnrollment with id: ${taskId}. Maybe task wasn't created`);
        }

        return task;
    }

    async isTaskTemplateFromCourseTemplate(course: WithId<Document>, taskId: string) : Promise<boolean>{
        const taskIds: Array<ObjectId> = course.taskTemplates;
        const exists: boolean = taskIds.some(task => task.equals(new ObjectId(taskId)));
        if (!exists) {
            throw ApiError.AccessForbidden(`TaskTemplate with id ${taskId} not from this courseTemplate`);
        }

        return exists;
    }

    async isTaskEnrollmentFromCourseEnrollment(course: WithId<Document>, taskId: string) : Promise<boolean>{
        const taskIds: Array<ObjectId> = course.tasks;
        const exists: boolean = taskIds.some(task => task.equals(new ObjectId(taskId)));
        if (!exists) {
            throw ApiError.AccessForbidden(`TaskEnrollment with id ${taskId} not from this courseEnrollment`);
        }

        return exists;
    }
}

module.exports = new TaskService();