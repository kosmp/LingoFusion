import {ObjectId} from "mongodb";

class TaskService {
    async getTasksByListOfIds(tasks: Array<ObjectId>) {
        
    }
}

module.exports = new TaskService();