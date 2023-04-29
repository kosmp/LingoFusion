import {ObjectId} from 'mongodb';
import {Task, tasksDb} from './task';
import {TestModelType, TaskTypes} from '../utils/types';

export class ClosedTestQuestion implements Task {
    private id!: ObjectId;

    async initialize(model: TestModelType): Promise<ObjectId> {
        this.id = await tasksDb.insertOne({
            taskType: model.taskType,
            title: model.title,
            description: model.description,
            question: model.question,
            trueAnswerNum: model.trueAnswerNum,
            receivedAnswerNum: model.receivedAnswerNum,
            expForTrueAnswer: model.expForTrueAnswer
        })

        return this.id;
    }

    async get_id(): Promise<ObjectId> {
        return this.id;
    }

    async get_title(): Promise<string> {
        return (await tasksDb.findOne({_id: this.id}))?.title;
    }

    async get_description(): Promise<string> {
        return (await tasksDb.findOne({_id: this.id}))?.description;
    }

    async get_taskType(): Promise<TaskTypes> {
        return (await tasksDb.findOne({_id: this.id}))?.taskType;
    }

    async get_expForTrueAnswer(): Promise<number> {
        return (await tasksDb.findOne({_id: this.id}))?.expForTrueAnswer;
    }

    async get_question() : Promise<string> {
        return (await tasksDb.findOne({_id: this.id}))?.question;
    }

    async get_trueAnswerNum() : Promise<number> {
        return (await tasksDb.findOne({_id: this.id}))?.trueAnswerNum;
    }

    async get_receivedAnswerNum() : Promise<number> {
        return (await tasksDb.findOne({_id: this.id}))?.receivedAnswerNum;
    }
    
    static async get_titleById(id: ObjectId): Promise<string> {
        return (await tasksDb.findOne({_id: id}))?.title;
    }

    static async get_descriptionById(id: ObjectId): Promise<string> {
        return (await tasksDb.findOne({_id: id}))?.description;
    }

    static async get_taskTypeById(id: ObjectId): Promise<TaskTypes> {
        return (await tasksDb.findOne({_id: id}))?.taskType;
    }

    static async get_expForTrueAnswerById(id: ObjectId): Promise<number> {
        return (await tasksDb.findOne({_id: id}))?.expForTrueAnswer;
    }

    static async get_questionById(id: ObjectId) : Promise<string> {
        return (await tasksDb.findOne({_id: id}))?.question;
    }

    static async get_trueAnswerNumById(id: ObjectId) : Promise<number> {
        return (await tasksDb.findOne({_id: id}))?.trueAnswerNum;
    }

    static async get_receivedAnswerNumById(id: ObjectId) : Promise<number> {
        return (await tasksDb.findOne({_id: id}))?.receivedAnswerNum;
    }
}