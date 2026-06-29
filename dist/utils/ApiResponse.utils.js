class ApiResponse {
    statusCode;
    data;
    message;
    success;
    constructor(statusCode, data, message = "request was successful") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}
export { ApiResponse };
//# sourceMappingURL=ApiResponse.utils.js.map