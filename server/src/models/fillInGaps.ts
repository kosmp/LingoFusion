import {ObjectId} from 'mongodb';
import {TaskTemplate} from './taskTemplate';
import {FillInGapsModelType, Blank} from '../utils/types';
import {TaskType} from '../utils/enums';

export class FillInGaps extends TaskTemplate {
    public static async initialize(model: FillInGapsModelType): Promise<ObjectId> {
        const taskTemplateId = super.initialize(model);

        await this.collection.updateOne(
            {_id: taskTemplateId},
            {
                taskType: TaskType.FillGaps,
                text: model.text,
                blanks: model.blanks
            }
        )

        return taskTemplateId;
    }

    public static async updateTask(model: FillInGapsModelType) {   
        await super.updateTask(model);

        await this.collection.updateOne(
            {_id: model._id},
            {
                taskType: TaskType.FillGaps,
                text: model.text,
                blanks: model.blanks
            }
        )
    }

    public static async check(taskTemplateId: ObjectId, userAnswers: string[] | null): Promise<boolean> {
        if (userAnswers === null || userAnswers.length === 0) {
            return false;
        }

        const blanks: Array<Blank> = (await this.collection.findOne({_id: taskTemplateId}))?.blanks;

        if (userAnswers.length !== blanks.length) {
            return false; // the number of user responses does not match the number of gaps in the task
        }
        
        let isCorrect = true;
        for (let i = 0; i < blanks.length; i++) {
            if (userAnswers[i] !== blanks[i].answer) {
                isCorrect = false;
                break; // if the user gave an incorrect answer, then the task is considered incorrect
            }
        }
        
        return isCorrect;
    }
}
