import { Router } from "express";
import { registerUser, loginUser, logoutUser, currentUser, getInitialData, } from "../controllers/user.controllers.js";
import { authUser } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();
router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(authUser, logoutUser);
router.route("/currentUser").get(authUser, currentUser);
router.route("/getInitialData").post(getInitialData);
export default router;
//# sourceMappingURL=user.routes.js.map