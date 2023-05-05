import {ObjectId} from 'mongodb';
import {Task} from './task';
import {FillInGapsModelType, TaskType} from '../utils/types';
import {tasks} from '../utils/database';

export class FillInGaps extends Task {
    constructor() {
        super();
    }

    async initialize(model: FillInGapsModelType): Promise<ObjectId> {
        super.initialize(model);

        await this.db.updateOne(
            {_id: this._id},
            {
                taskType: TaskType.FillGaps,
                content: model.content,
                options: model.options,
                correctAnswers: model.correctAnswers,
                expForTrueAnswers: model.expForTrueAnswers
            }
        )

        return this._id;
    }

    static async updateTask(model: FillInGapsModelType) {   
        await super.updateTask(model);

        await tasks.updateOne(
            {_id: model._id},
            {
                content: model.content,
                options: model.options,
                correctAnswers: model.correctAnswers,
                expForTrueAnswers: model.expForTrueAnswers
            }
        )
    }

    async get_content(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.content;
    }

    async get_options(): Promise<Array<string>> {
        return (await this.db.findOne({_id: this._id}))?.options;
    }

    async get_correctAnswers(): Promise<Array<string>> {
        return (await this.db.findOne({_id: this._id}))?.correctAnswers;
    }

    async get_expForTrueAnswers(): Promise<Array<number>> {
        return (await this.db.findOne({_id: this._id}))?.expForTrueAnswers;
    }

    async set_content(content: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {content: content});
    } 

    async set_options(options: Array<string>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {options: options});
    } 

    async set_correctAnswers(correctAnswers: Array<string>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {correctAnswers: correctAnswers});
    } 

    async set_expForTrueAnswers(expForTrueAnswers: Array<number>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {expForTrueAnswers: expForTrueAnswers});
    } 
}
