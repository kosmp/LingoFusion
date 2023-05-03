import {ObjectId} from 'mongodb';
import {Task, tasks} from './task';
import {TestModelType, TaskType} from '../utils/types';

export class TestQuestion extends Task {
    async initialize(model: TestModelType): Promise<ObjectId> {
        super.initialize(model);

        await tasks.updateOne(
            {_id: this._id},
            {
                taskType: TaskType.Test,
                question: model.question,
                trueAnswers: model.trueAnswers,
                receivedAnswers: model.receivedAnswers,
                expForTrueTask: model.expForTrueTask
            }
        )

        return this._id;
    }

    async get_expForTrueTask(): Promise<number> {
        return (await tasks.findOne({_id: this._id}))?.expForTrueTask;
    }

    async get_question() : Promise<string> {
        return (await tasks.findOne({_id: this._id}))?.question;
    }

    async get_trueAnswers() : Promise<Array<number>> {
        return (await tasks.findOne({_id: this._id}))?.trueAnswers;
    }

    async get_receivecdAnswers() : Promise<Array<number>> {
        return (await tasks.findOne({_id: this._id}))?.receivedAnswers;
    }

    async set_question(question: string) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {question: question});
    } 

    async set_receivedAnswers(answers: Array<number>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {receivedAnswers: answers});
    } 

    async set_trueAnswers(answers: Array<number>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {trueAnswers: answers});
    } 

    async set_expForTrueTask(expForTrueTask: number) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {expForTrueTask: expForTrueTask});
    } 
}