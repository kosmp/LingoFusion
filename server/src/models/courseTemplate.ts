import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {CourseTemplateModelType} from '../utils/types';

export class CourseTemplate {
    static readonly collection: DB = new DB('course-templates');

    static async initialize(model: CourseTemplateModelType) {
        const courseTemplateId: ObjectId = await this.collection.insertOne({
            public: model.public,
            title: model.title,
            description: model.description,
            englishLvl: model.englishLvl,
            imageUrl: model.imageUrl,
            rating: model.rating,
            numberOfRatings: model.numberOfRatings,
            taskTemplates: model.taskTemplates,
            tags: model.tags,
            authorId: model.authorId,
            numberOfCompletedCourses: model.numberOfCompletedCourses
        })

        return courseTemplateId;
    }

    static async deleteCourseById(id : ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }

    static async updateCourse(model: CourseTemplateModelType) {
        await this.collection.updateOne(
            {_id: model._id},
            {...model}
        )
    }

    static async addTag(courseId: ObjectId, tag: string) : Promise<void> {
        const tags : Set<string> = (await this.collection.findOne({_id: new ObjectId(courseId)}))?.tags;
        tags.add(tag);
        await this.collection.findAndUpdateById(courseId, {tags: tags});
    }

    static async deleteTag(courseId: ObjectId, tag: string) : Promise<boolean> {
        const tags : Set<string> = (await this.collection.findOne({_id: new ObjectId(courseId)}))?.tags;
        const deleteRes = tags.delete(tag);
        await this.collection.findAndUpdateById(courseId, {tags: tags});
        return deleteRes;
    }

    static async addTaskId(courseId: ObjectId, task: ObjectId) {
        const tasks: Set<ObjectId> = new Set<ObjectId>((await this.collection.findOne({_id: new ObjectId(courseId)}))?.taskTemplates);
        tasks.add(task);
        return await this.collection.findAndUpdateById(courseId, {taskTemplates: Array.from(tasks)});
    }

    static async removeTaskId(courseId: ObjectId, task: ObjectId) {
        const tasks: Array<ObjectId> = (await this.collection.findOne({_id: new ObjectId(courseId)}))?.taskTemplates;

        const taskExists = tasks.some(task => task.equals(new ObjectId(task)));
        
        if (taskExists) {
            const index = tasks.findIndex((el) => el.equals(new ObjectId(task)));
            if (index !== -1) {
                tasks.splice(index, 1);
            }
        }

        return await this.collection.findAndUpdateById(courseId, {taskTemplates: tasks});
    }

    static async findCourseById(id: ObjectId) {
        return await this.collection.findOne({_id: new ObjectId(id)});
    }

    static async findAllCourses(query?: object) {
        return await this.collection.findAll(query);
    }

    static async getFilteredCourses(query: object[]) {
        return await this.collection.aggregate(query);
    }
}