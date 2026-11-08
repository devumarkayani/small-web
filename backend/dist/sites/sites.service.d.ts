import { Model } from 'mongoose';
import { Site, SiteDocument } from './site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
export declare function htmlToText(html: string): string;
export declare class SitesService {
    private model;
    constructor(model: Model<SiteDocument>);
    findByAddress(address: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Site, {}, {}> & Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateSiteDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Site, {}, {}> & Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Site, {}, {}> & Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    all(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Site, {}, {}> & Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
