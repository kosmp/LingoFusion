import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {TaskType, TaskModelType} from '../utils/types';
import {tasks} from '../utils/database';

export abstract class Task {
    protected _id!: ObjectId;
    protected db!: DB;
    
    constructor() {
        this.db = tasks;
    }

    public async initialize(model: TaskModelType): Promise<ObjectId> {
        this._id = await this.db.insertOne({
            title: model.title,
            description: model.description,
            taskType: undefined
        })

        return this._id;
    }

    static async updateTask(model: TaskModelType) {   
        await tasks.updateOneWithFieldsReplacement(
            {_id: model._id},
            {
                title: model.title,
                description: model.description
            }
        )
    }

    public async get_id(): Promise<ObjectId> {
        return this._id;
    }

    public async get_title(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.title;
    }

    public async get_description(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.description;
    }

    public async get_taskType(): Promise<TaskType> {
        return (await this.db.findOne({_id: this._id}))?.taskType;
    }

    public async set_title(title: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {title: title});
    } 

    public async set_description(description: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {description: description});
    } 

    public static async get_titleById(id: ObjectId): Promise<string> {
        return (await tasks.findOne({_id: id}))?.title;
    }

    public static async get_descriptionById(id: ObjectId): Promise<string> {
        return (await tasks.findOne({_id: id}))?.description;
    }

    public static async get_taskTypeById(id: ObjectId): Promise<TaskType> {
        return (await tasks.findOne({_id: id}))?.taskType;
    }
    
    public static async findTaskById(id: ObjectId) {
        return await tasks.findOne({_id: id});
    }

    static async deleteTaskById(id: ObjectId) {
        return await tasks.findAndDeleteById(id);
    }
}
