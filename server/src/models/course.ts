import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {CourseModelType, EnglishLvl} from '../utils/types';

export const courses = new DB('courses');

export class Course {
    private _id!: ObjectId;
    
    async initialize(model: CourseModelType) {
        this._id = await courses.insertOne({
            title: model.title,
            description: model.description,
            englishLvl: model.englishLvl,
            imageUrl: model.imageUrl,
            rating: model.rating,
            tasks: model.tasks
        })

        return this._id;
    }

    async get_id() {
        return this._id;
    }

    async get_title() {
        return (await courses.findOne({_id: this._id}))?.title;
    }

    async get_description() {
        return (await courses.findOne({_id: this._id}))?.description;
    }

    async get_englishLvl() {
        return (await courses.findOne({_id: this._id}))?.englishLvl;
    }

    async get_imageUrl() {
        return (await courses.findOne({_id: this._id}))?.imageUrl;
    }

    async get_rating() {
        return (await courses.findOne({_id: this._id}))?.rating;
    }

    async get_tasks() {
        return (await courses.findOne({_id: this._id}))?.tasks;
    }

    async set_title(title: string) : Promise<void> {
        await courses.findAndUpdateById(this._id, {title: title});
    } 

    async set_description(description: string) : Promise<void> {
        await courses.findAndUpdateById(this._id, {description: description});
    } 

    async set_englishLvl(englishLvl: EnglishLvl) : Promise<void> {
        await courses.findAndUpdateById(this._id, {englishLvl: englishLvl});
    } 

    async set_imageUrl(imageUrl: string) : Promise<void> {
        await courses.findAndUpdateById(this._id, {imageUrl: imageUrl});
    } 

    async set_rating(rating: string) : Promise<void> {
        await courses.findAndUpdateById(this._id, {rating: rating});
    } 

    async set_tasks(tasks: Set<ObjectId>) : Promise<void> {
        await courses.findAndUpdateById(this._id, {tasks: tasks});
    }

    async addTaskId(taskId: ObjectId) : Promise<void> {
        const tasks : Set<ObjectId> = (await courses.findOne({_id: this._id}))?.tasks;
        tasks.add(taskId);
        await courses.findAndUpdateById(this._id, {tasks: tasks});
    }

    async deleteTaskId(taskId: ObjectId) : Promise<boolean> {
        const tasks : Set<ObjectId> = (await courses.findOne({_id: this._id}))?.tasks;
        const deleteRes = tasks.delete(taskId);
        await courses.findAndUpdateById(this._id, {tasks: tasks});
        return deleteRes;
    }

    static async get_titleById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.title;
    }

    static async get_descriptionById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.description;
    }

    static async get_englishLvlById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.englishLvl;
    }

    static async get_imageUrlById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.imageUrl;
    }

    static async get_ratingById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.rating;
    }

    static async get_tasksById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.tasks;
    }

    static async set_tasksById(id: ObjectId, tasks: Set<ObjectId>) {
        return await courses.findAndUpdateById(id, {tasks: tasks});
    }

    static async findCourseById(id: ObjectId) {
        return await courses.findOne({_id: id});
    }

    static async deleteCourseById(id : ObjectId) {
        return await courses.findAndDeleteById(id);
    }
}