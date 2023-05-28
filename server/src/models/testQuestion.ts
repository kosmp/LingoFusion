import {ObjectId} from 'mongodb';
import {TaskTemplate} from './taskTemplate';
import {TestModelType} from '../utils/types';
import {TaskType} from '../utils/enums';

export class TestQuestion extends TaskTemplate {
    public static async initialize(model: TestModelType): Promise<ObjectId> {
        const taskTemplateId = await super.initialize(model);

        await this.collection.updateOne(
            {_id: taskTemplateId},
            {
                taskType: TaskType.Test,
                question: model.question,
                trueAnswers: model.trueAnswers,
                options: model.options
            }
        )

        return taskTemplateId;
    }

    public static async updateTask(model: TestModelType) {   
        await super.updateTask(model);
        
        await this.collection.updateOne(
            {_id: model._id},
            {
                taskType: TaskType.Test,
                question: model.question,
                trueAnswers: model.trueAnswers,
                options: model.options
            }
        )
    }

    public static async check(taskTemplateId: ObjectId, userAnswers: string[] | null): Promise<boolean> {
        if (userAnswers === null || userAnswers.length === 0) {
            return false;
        }

        const answers: Array<string> = (await this.collection.findOne({_id: taskTemplateId}))?.trueAnswers;
        
        const isCorrect = answers.every((element, index) => element === userAnswers[index]);
    
        return isCorrect;
    }
}