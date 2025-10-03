type ApiResponse<T> = {
    message: string
    status: number
    data: T
}

type PaginatedType = {
    items: [],
    totalCount: number,
    totalPages: number
}