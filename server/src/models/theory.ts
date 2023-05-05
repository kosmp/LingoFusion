import {ObjectId} from 'mongodb';
import {Task} from './task';
import {TheoryModelType, TaskType} from '../utils/types';
import {tasks} from '../utils/database';

export class Theory extends Task {
    constructor() {
        super();
    }

    async initialize(model: TheoryModelType): Promise<ObjectId> {
        await super.initialize(model);

        await this.db.updateOne(
            {_id: this._id},
            {
                taskType: TaskType.Theory,
                content: model.content,
                references: model.references,
                imagesUrl: model.images,
                expForTheory: model.expForTheory
            }
        )

        return this._id;
    }

    static async updateTask(model: TheoryModelType) {   
        await super.updateTask(model);
        console.log(model);
        await tasks.updateOne(
            {_id: model._id},
            {
                content: model.content,
                references: model.references,
                images: model.images,
                expForTheory: model.expForTheory
            }
        )
    }
    
    async get_content(): Promise<string> {
        return (await this.db.findOne({_id: this._id}))?.content;
    }

    async get_references(): Promise<Array<string>> {
        return (await this.db.findOne({_id: this._id}))?.references;
    }

    async get_images(): Promise<Array<string>> {
        return (await this.db.findOne({_id: this._id}))?.images;
    }

    async get_expForTheory(): Promise<number> {
        return (await this.db.findOne({_id: this._id}))?.expForTheory;
    }

    async set_content(content: string) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {content: content});
    } 

    async set_references(references: Array<string>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {references: references});
    } 

    async set_images(images: Array<string>) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {images: images});
    } 

    async set_expForTheory(expForTheory: number) : Promise<void> {
        await this.db.findAndUpdateById(new ObjectId(this._id), {expForTheory: expForTheory});
    } 
}
