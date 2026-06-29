import { Router } from "express";
import { authUser } from "../middlewares/auth.middlewares.js";
import { getCustomizedPlan } from "../controllers/customizedPlan.controllers.js";
const router = Router();
router.route("/getCustomizedPlan").post(authUser, getCustomizedPlan);
export default router;
//# sourceMappingURL=customizedPlan.routes.js.map