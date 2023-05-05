import {DB} from '../utils/database';
import {ObjectId} from "mongodb";
import {profiles} from '../utils/database';

export class Profile {
    private id!: ObjectId;
    protected db!: DB;

    constructor() {
        this.db = profiles;
    }

    async initialize() {
        this.id = await this.db.insertOne({
            username: '',
            email: '',
            englishLvl: ''
        })
        return this.id;
    }

    async get_username() {
        return (await this.db.findOne({_id: this.id}))?.username;
    }

    async get_email() {
        return (await this.db.findOne({_id: this.id}))?.email;
    }

    async get_englishLvl() {
        return (await this.db.findOne({_id: this.id}))?.englishLvl;
    }

    async set_username(username: string) {
        await this.db.updateOneField({_id: this.id}, 'username', username)
    }

    async set_email(email: string) {
        await this.db.updateOneField({_id: this.id}, 'email', email)
    }

    async set_englishLvl(englishLvl: string) {
        await this.db.updateOneField({_id: this.id}, 'englishLvl', englishLvl)
    }

    static async findProfileById(id: ObjectId) {
        return await profiles.findOne({_id: id});
    }

    static async findProfileByIdAndDelete(id: ObjectId) {
        return await profiles.findAndDeleteById(id);
    }
}