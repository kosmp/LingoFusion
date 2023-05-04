import {Document, ObjectId, WithId} from "mongodb";
import {Task} from "../models/task";

class TaskService {
    async getTasksByListOfIds(tasks: Array<ObjectId>) {
        const resultTasks: Array<WithId<Document> | null> = new Array<WithId<Document> | null>();
        
        for (const taskId of tasks) {
            const task: WithId<Document> | null = await Task.findTaskById(taskId);

            if (task) {
                resultTasks.push(task);
            }
        }
        return resultTasks;
    }
}

module.exports = new TaskService();