export declare class ApiError extends Error {
    statusCode: number;
    success: boolean;
    errors: any[];
    constructor(statusCode: number, errors?: never[], message?: string, stack?: string);
}
//# sourceMappingURL=ApiError.utils.d.ts.map