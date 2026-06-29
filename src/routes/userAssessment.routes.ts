import {Router } from "express";

import { setUserAssessment,buildCustomizedPlan,getUserAssessment } from "../controllers/userAssessment.controllers.js";


import { authUser } from "../middlewares/auth.middlewares.js";


const router = Router()


router.route("/setUserAssessment").post(authUser,setUserAssessment)
router.route("/buildCustomizedPlan").post(authUser,buildCustomizedPlan)
router.route("/getUserAssessment").post(authUser,getUserAssessment)


export default router




