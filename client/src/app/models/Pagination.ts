export interface MetaData {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

//perbedaan class dan interface adalah class harus di beri nilainya
//pada propertinya sedangkan interface hanya perlu typenya aja
export class PaginatedResponse<T> {
    items: T;
    metaData: MetaData;

    constructor(items: T, metaData: MetaData) {
        this.items = items;
        this.metaData = metaData
    }
}