import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {TaskEnrollmentModelType} from '../utils/types';

export class TaskEnrollment {
    protected static readonly collection: DB = new DB('task-enrollments');

    public static async initialize(model: TaskEnrollmentModelType): Promise<ObjectId> {
        const taskEnrollmentId: ObjectId = await this.collection.insertOne({
            taskTemplateId: model.taskTemplateId,
            taskType: model.taskType,
            status: model.status,
            title: model.title,
            description: model.description,
            expForTask: model.expForTask,
            startedAt: model.startedAt,
            completedAt: model.completedAt,
            userAnswers: model.userAnswers
        })

        return taskEnrollmentId;
    }

    public static async updateTask(model: TaskEnrollmentModelType) {   
        await this.collection.updateOne(
            {_id: model._id},
            {...model}
        )
    }

    public static async findTaskById(id: ObjectId) {
        return await this.collection.findOne({_id: id});
    }

    public static async deleteTaskById(id: ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }
}