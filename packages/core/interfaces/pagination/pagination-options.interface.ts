export interface PaginationOptions {
    page?: number;
    take?: number;
}

export interface PaginationResponse<K> extends PaginationOptions {
    total: number;
    totalPages: number;
    data: K[];
}
