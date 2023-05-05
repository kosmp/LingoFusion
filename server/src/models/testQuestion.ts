import {ObjectId} from 'mongodb';
import {Task} from './task';
import {TestModelType, TaskType} from '../utils/types';
import {tasks} from '../utils/database';

export class TestQuestion extends Task {
    constructor() {
        super();
    }

    async initialize(model: TestModelType): Promise<ObjectId> {
        super.initialize(model);

        await this.db.updateOne(
            {_id: this._id},
            {
                taskType: TaskType.Test,
                question: model.question,
                trueAnswers: model.trueAnswers
            }
        )

        return this._id;
    }

    static async updateTask(model: TestModelType) {   
        await super.updateTask(model);
        
        await tasks.updateOne(
            {_id: model._id},
            {
                question: model.question,
                trueAnswers: model.trueAnswers
            }
        )
    }

    async check(userAnswers: string[]): Promise<boolean> {
        const answers: Array<string> = (await this.db.findOne({_id: this._id}))?.trueAnswers;
        
        const isCorrect = answers.every((answer: string) => userAnswers.includes(answer));

        if (isCorrect) {
            // accrue experience to the user    
        }
    
        return isCorrect;
    }

    async get_question() : Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.question;
    }

    async get_trueAnswers() : Promise<Array<string>> {
        return (await this.db.findOne({_id: this._id}))?.trueAnswers;
    }

    async set_question(question: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {question: question});
    } 

    async set_trueAnswers(answers: Array<number>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {trueAnswers: answers});
    } 
}