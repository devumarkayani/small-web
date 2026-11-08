import { HydratedDocument } from 'mongoose';
export type PersonDocument = HydratedDocument<Person>;
export declare class Person {
    name: string;
    kind: string;
}
export declare const PersonSchema: import("mongoose").Schema<Person, import("mongoose").Model<Person, any, any, any, import("mongoose").Document<unknown, any, Person, any, {}> & Person & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Person, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Person>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Person> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
