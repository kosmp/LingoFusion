import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {TaskEnrollmentModelType} from '../utils/types';
import {taskEnrollments} from '../utils/database';
import {StatusType} from '../utils/enums';

export abstract class TaskEnrollment {
    protected _id!: ObjectId;
    protected db!: DB;
    
    constructor() {
        this.db = taskEnrollments;
    }

    public async initialize(model: TaskEnrollmentModelType): Promise<ObjectId> {
        this._id = await this.db.insertOne({
            taskTemplateId: model.taskTemplateId,
            status: model.status,
            title: model.title,
            description: model.description,
            expForTrueTask: model.expForTrueTask,
            startedAt: model.startedAt,
            completedAt: model.completedAt,
            answers: model.answers
        })

        return this._id;
    }

    static async updateTask(model: TaskEnrollmentModelType) {   
        await taskEnrollments.updateOneWithFieldsReplacement(
            {_id: model._id},
            {
                title: model.title,
                description: model.description,
                expForTrueTask: model.expForTrueTask
            }
        )
    }

    public async get_id(): Promise<ObjectId> {
        return this._id;
    }

    public async get_taskTemplateId(): Promise<ObjectId> {
        return (await this.db.findOne({_id: this._id}))?.taskTemplateId;
    }

    public async get_status(): Promise<StatusType> {
        return (await this.db.findOne({_id: this._id}))?.status;
    }

    public async get_title(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.title;
    }

    public async get_description(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.description;
    }

    public async get_expForTrueTask(): Promise<number> {
        return (await this.db.findOne({_id: this._id}))?.expForTrueTask;
    }

    public async get_startedAt(): Promise<Date> {
        return (await this.db.findOne({_id: this._id}))?.startedAt;
    }

    public async get_completedAt(): Promise<Date> {
        return (await this.db.findOne({_id: this._id}))?.completedAt;
    }

    public async get_answers(): Promise<Array<string>> {
        return (await this.db.findOne({_id: this._id}))?.answers;
    }

    public async set_taskTemplateId(taskTemplateId: ObjectId) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {taskTemplateId: taskTemplateId});
    } 

    public async set_status(status: StatusType) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {status: status});
    } 

    public async set_description(description: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {description: description});
    } 

    public async set_expForTrueTask(expForTrueTask: number) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {expForTrueTask: expForTrueTask});
    } 

    public async set_completedAt(completedAt: Date) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {completedAt: completedAt});
    } 

    public async set_answers(answers: Array<ObjectId>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {answers: answers});
    } 

    public static async findTaskById(id: ObjectId) {
        return await taskEnrollments.findOne({_id: id});
    }

    public static async deleteTaskById(id: ObjectId) {
        return await taskEnrollments.findAndDeleteById(id);
    }
}