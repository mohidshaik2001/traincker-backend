import { error } from 'node:console';
const asyncHandler = (requestHandler) => {
    return (req, res, next) => { Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); };
};
export { asyncHandler };
//# sourceMappingURL=asyncHandler.utils.js.map