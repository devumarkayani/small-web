import { Model } from 'mongoose';
import { Visit, VisitDocument } from './visit.schema';
declare class CreateVisitDto {
    personId: string;
    personName: string;
    address: string;
    title: string;
    method: string;
}
export declare class HistoryController {
    private visits;
    constructor(visits: Model<VisitDocument>);
    list(id: string): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Visit, {}, {}> & Visit & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    create(dto: CreateVisitDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Visit, {}, {}> & Visit & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Visit, {}, {}> & Visit & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
export {};
