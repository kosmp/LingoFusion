import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {CourseModelType, CourseUpdateModelType, EnglishLvl} from '../utils/types';

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
            tasks: model.tasks,
            tags: model.tags,
            authorId: model.authorId
        })

        return this._id;
    }

    static async updateCourse(model: CourseUpdateModelType) {
        await courses.updateOne(
            {_id: model._id},
            {...model}
        )
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

    async get_tags() {
        return (await courses.findOne({_id: this._id}))?.tags;
    }

    async get_authorId() {
        return (await courses.findOne({_id: this._id}))?.authorId;
    }

    async set_tags(tags: Set<string>) : Promise<void> {
        await courses.findAndUpdateById(this._id, {tags: tags});
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

    async addTag(tag: string) : Promise<void> {
        const tags : Set<string> = (await courses.findOne({_id: this._id}))?.tags;
        tags.add(tag);
        await courses.findAndUpdateById(this._id, {tags: tags});
    }

    async deleteTag(tag: string) : Promise<boolean> {
        const tags : Set<string> = (await courses.findOne({_id: this._id}))?.tags;
        const deleteRes = tags.delete(tag);
        await courses.findAndUpdateById(this._id, {tags: tags});
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

    static async get_tagsById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.tags;
    }

    static async get_authorIdById(id: ObjectId) {
        return (await courses.findOne({_id: id}))?.authorId;
    }

    static async set_titleById(id: ObjectId, title: string) {
        return await courses.findAndUpdateById(id, {title: title});
    }

    static async set_descriotionById(id: ObjectId, description: string) {
        return await courses.findAndUpdateById(id, {description: description});
    }

    static async set_englishLvlById(id: ObjectId, englishLvl: EnglishLvl) {
        return await courses.findAndUpdateById(id, {englishLvl: englishLvl});
    }

    static async set_imageUrlById(id: ObjectId, imageUrl: string) {
        return await courses.findAndUpdateById(id, {imageUrl: imageUrl});
    }

    static async set_ratingById(id: ObjectId, rating: number) {
        return await courses.findAndUpdateById(id, {rating: rating});
    }

    static async set_tasksById(id: ObjectId, tasks: Set<ObjectId>) {
        return await courses.findAndUpdateById(id, {tasks: tasks});
    }

    static async addTaskByIdToCourse(courseId: ObjectId, task: ObjectId) {
        const tasks: Array<ObjectId> = await Course.get_tasksById(courseId);
        tasks.push(task);
        return await courses.findAndUpdateById(courseId, {tasks: tasks});
    }

    static async removeTaskByIdFromCourseTasks(courseId: ObjectId, task: ObjectId) {
        const tasks: Array<ObjectId> = await Course.get_tasksById(new ObjectId(courseId));

        const taskExists = tasks.some(task => task.equals(new ObjectId(task)));
        
        if (taskExists) {
            const index = tasks.findIndex((el) => el.equals(new ObjectId(task)));
            if (index !== -1) {
                tasks.splice(index, 1);
            }
        }

        return await courses.findAndUpdateById(courseId, {tasks: tasks});
    }

    static async set_tagsById(id: ObjectId, tags: Set<string>) {
        return await courses.findAndUpdateById(id, {tags: tags});
    }

    static async findCourseById(id: ObjectId) {
        return await courses.findOne({_id: id});
    }

    static async deleteCourseById(id : ObjectId) {
        return await courses.findAndDeleteById(id);
    }

    static async getAllCourses() {
        return await courses.findAll();
    }
}