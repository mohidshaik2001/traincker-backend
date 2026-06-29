import { Router } from "express";
import { getRandomSupplements } from "../controllers/supplement.controllers.js";
const router = Router();
router.route("/getRandomSupplements").get(getRandomSupplements);
export default router;
//# sourceMappingURL=supplement.routes.js.map