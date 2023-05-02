import {DB} from '../utils/database';
import {ObjectId} from "mongodb";

export const tokens = new DB('user-tokens');

export class Token {
    private _id!: ObjectId;

    async initialize(userId: ObjectId, refreshTokenn: string) {
        this._id = await tokens.insertOne({
            user: userId,
            refreshToken: refreshTokenn
        })

        return this._id;
    }

    async get_refreshToken() {
        return (await tokens.findOne({_id: this._id}))?.refreshToken;
    }

    async update_refreshToken(refreshToken: string) {
        await tokens.updateOneField({_id: this._id}, 'refreshToken', refreshToken)
    }

    static async updateToken(token: object, field: string, value: string) {
        return await tokens.updateOneField(token, field, value);
    }

    static async getTokenByUserId(userId: ObjectId) {
        return await tokens.findOne({user: userId});
    }

    static async deleteToken(refresh_token: string) {
        return await tokens.deleteOne({refreshToken: refresh_token});
    }

    static async findTokenByUserID(userId: ObjectId) {
        return await tokens.findOne({user: userId});
    }

    static async findTokenByIdAndDelete(userId: ObjectId) {
        return await tokens.findAndDeleteById(userId);
    }
}