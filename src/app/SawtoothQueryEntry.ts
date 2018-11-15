import { SawtoothPagingEntry } from "./SawtoothPagingEntry";

export class SawtoothQueryEntry
{

    constructor (public data:string, public head:string, public link:string, public page:SawtoothPagingEntry){};
}