import {DB} from '../utils/database';
import {ObjectId} from "mongodb";

export class Token {
    static readonly collection: DB = new DB('user-tokens');

    static async initialize(userId: ObjectId, refreshTokenn: string) {
        const tokenId = await this.collection.insertOne({
            user: userId,
            refreshToken: refreshTokenn
        })

        return tokenId;
    }

    static async get_refreshToken(tokenId: ObjectId) {
        return (await this.collection.findOne({_id: tokenId}))?.refreshToken;
    }

    static async update_refreshToken(tokenId: ObjectId, refreshToken: string) {
        await this.collection.updateOneField({_id: tokenId}, 'refreshToken', refreshToken)
    }

    static async updateToken(token: object, field: string, value: string) {
        return await this.collection.updateOneField(token, field, value);
    }

    static async getTokenByUserId(userId: ObjectId) {
        return await this.collection.findOne({user: userId});
    }

    static async deleteToken(refresh_token: string) {
        return await this.collection.deleteOne({refreshToken: refresh_token});
    }

    static async findTokenByUserID(userId: ObjectId) {
        return await this.collection.findOne({user: userId});
    }

    static async findTokenByIdAndDelete(userId: ObjectId) {
        return await this.collection.findAndDeleteById(userId);
    }
}