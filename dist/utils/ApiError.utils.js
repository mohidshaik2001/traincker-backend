export class ApiError extends Error {
    statusCode;
    success;
    errors;
    constructor(statusCode, errors = [], message = "Something went wrong", stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
//# sourceMappingURL=ApiError.utils.js.map