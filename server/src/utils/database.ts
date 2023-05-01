import {MongoClient, Collection, Db, ObjectId} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI: string | undefined = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;

export const CLIENT = new MongoClient(DB_URI!);

export class DB {
    public collection!: Collection;
    private client!: MongoClient;
    private db !: Db;

    constructor(private collectionName: string) {
        this.client = CLIENT;
        this.db = this.client.db(DB_NAME)
        this.collection = this.db.collection(this.collectionName);
    }

    async find(query?: object) {
        return (await this.collection.find(query || {})).next();
    }

    async findAll(query?: object) {
        return await this.collection.find(query || {}).toArray();
    }

    async findOne(query: object) {
        return await this.collection.findOne(query);
    }

    async insertOne(document: object) {
        const result = await this.collection.insertOne(document);
        return result.insertedId;
    }

    async updateOneField(query: object, field: string, value: string) {
        const new_data: any  = await this.findOne(query)
        new_data[field] = value
        const result = await this.collection.updateOne(query, { $set: new_data });
        return result.modifiedCount;
    }

    async updateOne(query: object, update: object) {
        const result = await this.collection.updateOne(query, { $set: update });
        return result.modifiedCount;
    }

    async updateMany(filter: object, update: object) {
        await this.collection.updateMany(filter, update);
    }

    async deleteOne(query: object) {
        const result = await this.collection.deleteOne(query);
        return result.deletedCount;
    }

    async deleteMany(query: object) {
        await this.collection.deleteMany(query);
    }

    async findAndDeleteById(id: ObjectId) {
        return await this.collection.findOneAndDelete({"_id": id})
    }

    async findAndUpdateById(id: ObjectId, newObject: object) {
        await this.collection.updateOne({_id: id}, {$set: newObject})
    }

    async aggregate(query: object[]) {
        const res = await (await this.collection.aggregate(query)).toArray();
        return res[0];
    }
}