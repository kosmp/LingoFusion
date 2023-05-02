import { DB } from '../utils/database';
import { ObjectId } from "mongodb";

export const profiles = new DB('profiles');

export class Profile {
    private id!: ObjectId;

    async initialize() {
        this.id = await profiles.insertOne({
            username: '',
            email: '',
            englishLvl: ''
        })
        return this.id;
    }

    async get_username() {
        return (await profiles.findOne({_id: this.id}))?.username;
    }

    async get_email() {
        return (await profiles.findOne({_id: this.id}))?.email;
    }

    async get_englishLvl() {
        return (await profiles.findOne({_id: this.id}))?.englishLvl;
    }

    async set_username(username: string) {
        await profiles.updateOneField({_id: this.id}, 'username', username)
    }

    async set_email(email: string) {
        await profiles.updateOneField({_id: this.id}, 'email', email)
    }

    async set_englishLvl(englishLvl: string) {
        await profiles.updateOneField({_id: this.id}, 'englishLvl', englishLvl)
    }

    static async findProfileById(id: ObjectId) {
        return await profiles.findOne({_id: id});
    }

    static async findProfileByIdAndDelete(id: ObjectId) {
        return await profiles.findAndDeleteById(id);
    }
}