import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {CourseModelType} from '../utils/types';

export const coursesDb = new DB('courses');

export class Course {
    private id!: ObjectId;
    
    async initialize(model: CourseModelType) {
        this.id = await coursesDb.insertOne({
            title: model.title,
            description: model.description,
            englishLvl: model.englishLvl,
            imageUrl: model.imageUrl,
            tasks: model.tasks
        })

        return this.id;
    }

    async get_id() {
        return this.id;
    }

    async get_description() {
        return (await coursesDb.findOne({_id: this.id}))?.description;
    }

    async get_englishLvl() {
        return (await coursesDb.findOne({_id: this.id}))?.englishLvl;
    }

    async get_imageUrl() {
        return (await coursesDb.findOne({_id: this.id}))?.imageUrl;
    }

    async get_tasks() {
        return (await coursesDb.findOne({_id: this.id}))?.tasks;
    }

    static async get_descriptionById(id: ObjectId) {
        return (await coursesDb.findOne({_id: id}))?.description;
    }

    static async get_englishLvlById(id: ObjectId) {
        return (await coursesDb.findOne({_id: id}))?.englishLvl;
    }

    static async get_imageUrlById(id: ObjectId) {
        return (await coursesDb.findOne({_id: id}))?.imageUrl;
    }

    static async get_tasksById(id: ObjectId) {
        return (await coursesDb.findOne({_id: id}))?.tasks;
    }

    static async findCourseById(id: ObjectId) {
        return await coursesDb.findOne({_id: id});
    }
}