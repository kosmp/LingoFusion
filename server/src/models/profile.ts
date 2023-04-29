import { DB } from '../utils/database';
import { ObjectId } from "mongodb";

export const profilesDb = new DB('profiles');

export class Profile {
    private id!: ObjectId;

    async initialize() {
        this.id = await profilesDb.insertOne({
            username: '',
            email: '',
            englishLvl: ''
        })
        return this.id;
    }

    async get_username() {
        return (await profilesDb.findOne({_id: this.id}))?.username;
    }

    async get_email() {
        return (await profilesDb.findOne({_id: this.id}))?.email;
    }

    async get_englishLvl() {
        return (await profilesDb.findOne({_id: this.id}))?.englishLvl;
    }

    async set_username(username: string) {
        await profilesDb.updateOneField({_id: this.id}, 'username', username)
    }

    async set_email(email: string) {
        await profilesDb.updateOneField({_id: this.id}, 'email', email)
    }

    async set_englishLvl(englishLvl: string) {
        await profilesDb.updateOneField({_id: this.id}, 'englishLvl', englishLvl)
    }
}