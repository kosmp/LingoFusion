import {ObjectId} from 'mongodb';
import {Task, tasks} from './task';
import {TheoryModelType, TaskType} from '../utils/types';

export class Theory extends Task {
    async initialize(model: TheoryModelType): Promise<ObjectId> {
        await super.initialize(model);

        await tasks.updateOne(
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
    
    async get_content(): Promise<string> {
        return (await tasks.findOne({_id: this._id}))?.content;
    }

    async get_references(): Promise<Array<string>> {
        return (await tasks.findOne({_id: this._id}))?.references;
    }

    async get_images(): Promise<Array<string>> {
        return (await tasks.findOne({_id: this._id}))?.images;
    }

    async get_expForTheory(): Promise<number> {
        return (await tasks.findOne({_id: this._id}))?.expForTheory;
    }

    async set_content(content: string) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {content: content});
    } 

    async set_references(references: Array<string>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {references: references});
    } 

    async set_images(images: Array<string>) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {images: images});
    } 

    async set_expForTheory(expForTheory: number) : Promise<void> {
        await tasks.findAndUpdateById(new ObjectId(this._id), {expForTheory: expForTheory});
    } 
}
