import {DB} from '../utils/database';
import {ObjectId} from "mongodb";

export class Profile {
    static readonly collection: DB = new DB('profiles');
    
    static async initialize() {
        const profileId: ObjectId = await this.collection.insertOne({
            username: '',
            email: '',
            englishLvl: ''
        });

        return profileId;
    }

    static async deleteProfileById(id: ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }

    static async findProfileById(id: ObjectId) {
        return await this.collection.findOne({_id: new ObjectId(id)});
    }
}