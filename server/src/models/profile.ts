import {DB} from '../utils/database';
import {ObjectId} from "mongodb";
import {ProfileModelType} from '../utils/types';

export class Profile {
    static readonly collection: DB = new DB('profiles');
    
    static async initialize(model: ProfileModelType) {
        const profileId: ObjectId = await this.collection.insertOne({
            username: model.username,
            email: model.email,
            englishLvl: model.englishLvl
        });

        return profileId;
    }

    static async updateProfile(model: ProfileModelType) {
        await this.collection.updateOne(
            {_id: model._id},
            {...model}
        )
    }

    static async deleteProfileById(id: ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }

    static async addExpToProfile(id: ObjectId, experience: number) {
        const currentExp = (await this.collection.findOne({_id: new ObjectId(id)}))?.exp;

        return await this.collection.updateOne(
            {_id: id},
            {exp: currentExp + experience}
        );
    }

    static async findProfileById(id: ObjectId) {
        return await this.collection.findOne({_id: new ObjectId(id)});
    }
}