import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {TaskTemplateModelType} from '../utils/types';
import {TaskType} from '../utils/enums';

export abstract class TaskTemplate {
    protected static readonly collection = new DB('task-templates');

    public static async initialize(model: TaskTemplateModelType): Promise<ObjectId> {
        const taskId = await this.collection.insertOne({
            title: model.title,
            description: model.description,
            expForTrueTask: model.expForTrueTask
        })

        return taskId;
    }

    static async updateTask(model: TaskTemplateModelType) {   
        await this.collection.updateOneWithFieldsReplacement(
            {_id: model._id},
            {
                title: model.title,
                description: model.description,
                expForTrueTask: model.expForTrueTask
            }
        )
    }
    
    public static async findTaskById(id: ObjectId) {
        return await this.collection.findOne({_id: id});
    }

    public static async deleteTaskById(id: ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }
}
