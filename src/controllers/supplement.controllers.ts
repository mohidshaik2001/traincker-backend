import { asyncHandler } from "../utils/asyncHandler.utils.js";
import Supplement from "../models/supplement.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

export const getRandomSupplements = asyncHandler(async (req, res) => {
  try {
    const { optimalTiming } = req.query;
    if (!optimalTiming)
      throw new ApiError(400, [], "optimalTiming is required");
    const matchStage = optimalTiming
      ? { optimalTiming: optimalTiming as string }
      : {};
    const randomSupplements = await Supplement.aggregate([
      { $match: matchStage },
      { $sample: { size: 5 } },
    ]);
    res.status(200).json(new ApiResponse(200, randomSupplements));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof Error) {
      throw new ApiError(500, [], error.message);
    } else {
      throw new ApiError(500, [], "An unknown error occurred");
    }
  }
});
