import { HydratedDocument } from 'mongoose';
export type SiteDocument = HydratedDocument<Site>;
export declare class Site {
    address: string;
    title: string;
    html: string;
    author: string;
    textContent: string;
}
export declare const SiteSchema: import("mongoose").Schema<Site, import("mongoose").Model<Site, any, any, any, import("mongoose").Document<unknown, any, Site, any, {}> & Site & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Site, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Site>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Site> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
