import { CreateSiteDto } from './dto/create-site.dto';
import { SitesService } from './sites.service';
export declare class SitesController {
    private readonly sites;
    constructor(sites: SitesService);
    all(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./site.schema").Site, {}, {}> & import("./site.schema").Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    byAddress(address: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./site.schema").Site, {}, {}> & import("./site.schema").Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateSiteDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./site.schema").Site, {}, {}> & import("./site.schema").Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./site.schema").Site, {}, {}> & import("./site.schema").Site & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
