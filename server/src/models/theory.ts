import {ObjectId} from 'mongodb';
import {TaskTemplate} from './taskTemplate';
import {TheoryModelType} from '../utils/types';
import {TaskType} from '../utils/enums';

export class Theory extends TaskTemplate {
    public static async initialize(model: TheoryModelType): Promise<ObjectId> {
        const taskTemplateId = await super.initialize(model);

        await this.collection.updateOne(
            {_id: taskTemplateId},
            {
                taskType: TaskType.Theory,
                content: model.content,
                references: model.references,
                imagesUrl: model.images
            }
        )

        return taskTemplateId;
    }

    public static async updateTask(model: TheoryModelType) {   
        await super.updateTask(model);

        await this.collection.updateOne(
            {_id: model._id},
            {
                taskType: TaskType.Theory,
                content: model.content,
                references: model.references,
                images: model.images
            }
        )
    }
    
    public static async check(taskTemplateId: ObjectId, userAnswers: string[] | null): Promise<boolean> {
        return true;    // no check questions needed
    }
}
