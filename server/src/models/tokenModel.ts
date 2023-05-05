import {DB} from '../utils/database';
import {ObjectId} from "mongodb";
import {tokens} from '../utils/database';

export class Token {
    private _id!: ObjectId;
    protected db!: DB;

    constructor() {
        this.db = tokens;
    }

    async initialize(userId: ObjectId, refreshTokenn: string) {
        this._id = await this.db.insertOne({
            user: userId,
            refreshToken: refreshTokenn
        })

        return this._id;
    }

    async get_refreshToken() {
        return (await this.db.findOne({_id: this._id}))?.refreshToken;
    }

    async update_refreshToken(refreshToken: string) {
        await this.db.updateOneField({_id: this._id}, 'refreshToken', refreshToken)
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