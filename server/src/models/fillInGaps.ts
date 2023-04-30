import {ObjectId} from 'mongodb';
import {Task, tasks} from './task';
import {FillInGapsModelType, TaskType} from '../utils/types';

export class FillInGaps extends Task {
    async initialize(model: FillInGapsModelType): Promise<ObjectId> {
        super.initialize(model);

        await tasks.updateOne(
            {_id: this._id},
            { $set: {
                taskType: TaskType.FillGaps,
                content: model.content,
                options: model.options,
                correctAnswers: model.correctAnswers,
                expForTrueAnswers: model.expForTrueAnswers
            }}
        )

        return this._id;
    }

    async get_content(): Promise<string> {
        return (await tasks.findOne({_id: this._id}))?.content;
    }

    async get_options(): Promise<Array<string>> {
        return (await tasks.findOne({_id: this._id}))?.options;
    }

    async get_correctAnswers(): Promise<Array<string>> {
        return (await tasks.findOne({_id: this._id}))?.correctAnswers;
    }

    async get_expForTrueAnswers(): Promise<Array<number>> {
        return (await tasks.findOne({_id: this._id}))?.expForTrueAnswers;
    }

    async set_content(content: string) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {content: content});
    } 

    async set_options(options: Array<string>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {options: options});
    } 

    async set_correctAnswers(correctAnswers: Array<string>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {correctAnswers: correctAnswers});
    } 

    async set_expForTrueAnswers(expForTrueAnswers: Array<number>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {expForTrueAnswers: expForTrueAnswers});
    } 
}
