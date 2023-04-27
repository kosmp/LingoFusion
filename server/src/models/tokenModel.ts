import { DB } from '../database';
import { ObjectId } from "mongodb";

export class Token {
    static readonly tokensDb: DB = new DB('user-tokens');
    readonly db!: DB;
    private id!: ObjectId;

    constructor() {
        this.db = Token.tokensDb;
    }

    async Initialize(user_id: string, refreshTokenn: string) {
        this.id = await this.db.insertOne({
            user: new ObjectId(user_id),
            refreshToken: refreshTokenn
        })
        return this.id;
    }

    async get_refreshToken() {
        return (await this.db.findOne({_id: this.id}))?.refreshToken;
    }

    async update_refreshToken(refreshToken: string) {
        await this.db.updateOneField({_id: this.id}, 'refreshToken', refreshToken)
    }

    static async updateToken(token: object, field: string, value: string) {
        return await Token.tokensDb.updateOneField(token, field, value);
    }

    static async getTokenByUserId(user_id: string) {
        return await Token.tokensDb.findOne({user: user_id});
    }
}