import { Model } from 'mongoose';
import { SiteDocument } from '../sites/site.schema';
export declare class SearchController {
    private sites;
    constructor(sites: Model<SiteDocument>);
    search(q?: string): Promise<any[]>;
}
