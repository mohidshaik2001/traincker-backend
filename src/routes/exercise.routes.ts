import { Router } from "express";

import { getRandomExercises } from "../controllers/exercise.controllers.js";

const router = Router()


router.route("/getRandomExercises").get(getRandomExercises)

export default router