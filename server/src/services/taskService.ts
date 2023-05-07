import {Document, ObjectId, WithId} from "mongodb";
import {TaskTemplate} from "../models/taskTemplate";
import {TaskEnrollment} from "../models/taskEnrollment";
import {TaskType} from '../utils/enums';

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
}

module.exports = new TaskService();