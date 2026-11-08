import { HydratedDocument } from 'mongoose';
export type VisitDocument = HydratedDocument<Visit>;
export declare class Visit {
    personId: string;
    personName: string;
    address: string;
    title: string;
    method: string;
    visitedAt: Date;
}
export declare const VisitSchema: import("mongoose").Schema<Visit, import("mongoose").Model<Visit, any, any, any, import("mongoose").Document<unknown, any, Visit, any, {}> & Visit & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Visit, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Visit>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Visit> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
