import {ObjectId} from 'mongodb';
import {Task} from './task';
import {FillInGapsModelType, TaskType, Blank} from '../utils/types';
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
                text: model.text,
                blanks: model.blanks
            }
        )

        return this._id;
    }

    static async updateTask(model: FillInGapsModelType) {   
        await super.updateTask(model);

        await tasks.updateOne(
            {_id: model._id},
            {
                taskType: TaskType.FillGaps,
                text: model.text,
                blanks: model.blanks
            }
        )
    }

    async check(userAnswers: string[]): Promise<boolean> {
        const blanks: Array<Blank> = (await this.db.findOne({_id: this._id}))?.blanks;

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
        
        if (isCorrect) {
            // accrue experience to the user
        }
        
        return isCorrect;
    }

    async get_text(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.text;
    }

    async get_blanks() {
        return (await this.db.findOne({_id: this._id}))?.blanks;
    }

    async set_text(text: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {text: text});
    } 

    async set_blanks(blanks: Array<Blank>) {
        await this.db.findAndUpdateById(new ObjectId(this._id), {blanks: blanks});
    } 
}
