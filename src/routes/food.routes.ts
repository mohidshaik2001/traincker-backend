import { Router } from "express";
import {
  getAllFoods,
  getRandomFoods,
} from "../controllers/food.controllers.js";

const router = Router();

router.route("/getRandomFoods").get(getRandomFoods);
router.route("/getAllFoods").get(getAllFoods);

export default router;
