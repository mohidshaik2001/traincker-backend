import { Types } from "mongoose";
import { Biometrics } from "../models/biometrics.models.js";
import Food from "../models/food.models.js";
import Exercise from "../models/exercise.models.js";
import Supplement from "../models/supplement.models.js";
import { CustomizedDietPlan } from "../models/customizedDietPlan.models.js";
import { CustomizedTrainingPlan } from "../models/customizedTrainingPlan.models.js";
import { CustomizedSupplementPlan } from "../models/customizedSupplementPlan.models.js";
import { ApiError } from "./ApiError.utils.js";
export const generatePlan = async (biometrics, dietPreference, reverseEngineeredMetrics) => {
    try {
        const trainingArchitecture = determineTrainingArchitecture(biometrics.baseLineCapacity);
        console.log("\n-----------\n", trainingArchitecture, "\n-----------\n");
        const targetMacros = calculateTargetmacros(biometrics, reverseEngineeredMetrics.weight, trainingArchitecture.weightsDays);
        const reverseEngineeredMetricsCalculated = {
            ...reverseEngineeredMetrics,
            macros: targetMacros,
            time: new Date(),
        };
        const dietPlan = await buildDietPlan(targetMacros, dietPreference);
        console.log("\n-----------\n", dietPlan, "\n-----------\n");
        if (!dietPlan) {
            console.log("error in generating plan at diet plan");
            return null;
        }
        const TrainingPlan = await buildTrainingPlan(trainingArchitecture);
        console.log("\n-----------\n", TrainingPlan, "\n-----------\n");
        if (!TrainingPlan) {
            console.log("error in generating plan at training plan");
            return null;
        }
        const supplementPlan = await buildSupplementPlan(dietPreference);
        console.log("\n-----------\n", supplementPlan, "\n-----------\n");
        if (!supplementPlan) {
            console.log("error in generating plan at supplement plan");
            return null;
        }
        //code to generate plan
        return {
            dietPlan,
            TrainingPlan,
            supplementPlan,
            reverseEngineeredMetricsCalculated,
        };
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return null;
    }
};
export const processBiometrics = async (biometrics) => {
    try {
        const newBiometrics = biometrics;
        newBiometrics.currentFatPercentage = calculateFatPercentage(biometrics.gender, biometrics.measurements.weight, biometrics.measurements.height, biometrics.measurements.neck, biometrics.measurements.waist, biometrics.measurements.hips);
        newBiometrics.currentTdee = calculateTdee(biometrics.measurements.weight, biometrics.measurements.height, biometrics.age, biometrics.gender);
        return newBiometrics;
    }
    catch (error) {
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return biometrics;
    }
};
export const calculateFatPercentage = (gender, weight, height, neck, waist, hips) => {
    const normalizedGender = gender.toLowerCase();
    if (normalizedGender === "male" || normalizedGender === "m") {
        if (waist <= neck)
            return 0; // Prevent NaN on log10 of negative or zero values
        const densityMale = 1.0324 -
            0.19077 * Math.log10(waist - neck) +
            0.15456 * Math.log10(height);
        const bf = 495 / densityMale - 450;
        return Math.max(2, Math.round(bf * 10) / 10);
    }
    else {
        const femaleHips = hips || 0;
        if (waist + femaleHips <= neck)
            return 0;
        const densityFemale = 1.29579 -
            0.35004 * Math.log10(waist + femaleHips - neck) +
            0.221 * Math.log10(height);
        const bf = 495 / densityFemale - 450;
        return Math.max(10, Math.round(bf * 10) / 10); // Floor at 10% essential fat
    }
};
export const calculateTdee = (weight, height, age, gender) => {
    const normalizedGender = gender.toLowerCase();
    // Calculate Base Metabolic Rate (BMR)
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (normalizedGender === "male" || normalizedGender === "m") {
        bmr += 5;
    }
    else {
        bmr -= 161;
    }
    // Apply the 1.55 activity multiplier (Consistent with 4 weights + 2 cardio tracking split)
    const tdee = bmr * 1.55;
    return Math.round(tdee);
};
export const determineTrainingArchitecture = (baseLineCapacity) => {
    const rpe = baseLineCapacity?.weights?.waterJugRPE || 5;
    // Beginner: 3 Days Weights, 1 Day Cardio
    if (rpe <= 5) {
        return {
            splitName: "Full Body + Cardio",
            weightsDays: 3,
            cardioDays: 1,
            totalDaysPerWeek: 4,
            template: [
                "Full Body",
                "Rest",
                "Full Body",
                "Rest",
                "Full Body",
                "Cardio",
                "Rest",
            ],
        };
    }
    // Intermediate: 4 Days Weights, 1 Day Cardio
    else if (rpe <= 7) {
        return {
            splitName: "Upper/Lower Split",
            weightsDays: 4,
            cardioDays: 1,
            totalDaysPerWeek: 5,
            template: ["Upper", "Lower", "Rest", "Upper", "Lower", "Cardio", "Rest"],
        };
    }
    // Advanced: The 4+2 Hybrid (4 Days Weights, 2 Days Cardio)
    else {
        return {
            splitName: "4+2 Hybrid Split",
            weightsDays: 4,
            cardioDays: 2,
            totalDaysPerWeek: 6,
            template: [
                "Upper",
                "Lower",
                "Cardio",
                "Upper",
                "Lower",
                "Cardio",
                "Rest",
            ],
        };
    }
};
export const calculateTargetmacros = (biometrics, targetWeight, trainingDays) => {
    const currentWeight = biometrics.measurements.weight;
    let bmr = 0;
    // 1. Recalculate BMR to ensure accuracy (Mifflin-St Jeor)
    if (biometrics.gender.toLowerCase() === "male" ||
        biometrics.gender.toLowerCase() === "m") {
        bmr =
            10 * currentWeight +
                6.25 * biometrics.measurements.height -
                5 * biometrics.age +
                5;
    }
    else {
        bmr =
            10 * currentWeight +
                6.25 * biometrics.measurements.height -
                5 * biometrics.age -
                161;
    }
    // 2. Apply Dynamic Activity Multiplier based on generated training days
    let activityMultiplier = 1.2; // Sedentary baseline
    if (trainingDays === 3 || trainingDays === 4)
        activityMultiplier = 1.375;
    if (trainingDays === 5)
        activityMultiplier = 1.55;
    if (trainingDays >= 6)
        activityMultiplier = 1.725;
    const dynamicTdee = Math.round(bmr * activityMultiplier);
    // 3. Determine Goal Trajectory (Bulk vs Cut)
    let targetCalories = dynamicTdee;
    if (targetWeight > currentWeight) {
        targetCalories += 300; // +300 kcal for a lean/clean bulk
    }
    else if (targetWeight < currentWeight) {
        targetCalories -= 500; // -500 kcal for a standard cut
    }
    // 4. Calculate Industry Standard Macros
    // Protein: 2.2g per kg of TARGET weight
    const targetProtein = Math.round(targetWeight * 2.2);
    // Fat: 1.0g per kg of TARGET weight
    const targetFats = Math.round(targetWeight * 1.0);
    // Carbs: The remainder of the calories (Protein = 4 kcal/g, Fat = 9 kcal/g, Carbs = 4 kcal/g)
    const remainingCalories = targetCalories - targetProtein * 4 - targetFats * 9;
    const targetCarbs = Math.round(Math.max(0, remainingCalories / 4)); // Prevent negative carbs
    return {
        calories: targetCalories,
        protein: targetProtein,
        fats: targetFats,
        carbs: targetCarbs,
    };
};
export const determineMealSchedule = (targetCalories) => {
    // 3 Meals: Typically for aggressive cuts or smaller individuals
    if (targetCalories < 2200) {
        return ["Breakfast", "Pre-Workout", "Dinner"];
    }
    // 4 Meals: The standard baseline for maintenance or lean bulks
    else if (targetCalories <= 2800) {
        return ["Breakfast", "Lunch", "Pre-Workout", "Dinner"];
    }
    // 5 Meals: Extreme volume/Clean Bulks requiring gastric relief
    else {
        return ["Breakfast", "Lunch", "Pre-Workout", "Evening Snack", "Dinner"];
    }
};
export const buildDietPlan = async (targetMacros, dietPreference) => {
    try {
        const mealNames = determineMealSchedule(targetMacros.calories);
        const targetMealsPerDay = mealNames.length;
        const allowedFoodIds = dietPreference.acceptedFoods.map((af) => af.foodId);
        const availableFoods = await Food.find({
            _id: { $in: allowedFoodIds },
        }).lean();
        if (!availableFoods || !availableFoods.length) {
            throw new ApiError(400, [], "No accepted foods found for this diet preference.");
        }
        const proteinSources = [];
        const fatSources = [];
        const carbSources = [];
        availableFoods.forEach((food) => {
            const proteinCals = food.protein * 4;
            const fatCals = food.fats * 9;
            const carbCals = food.carbs * 4;
            if (proteinCals >= carbCals && proteinCals >= fatCals) {
                proteinSources.push(food);
            }
            else if (carbCals >= fatCals && carbCals >= proteinCals) {
                carbSources.push(food);
            }
            else {
                fatSources.push(food);
            }
        });
        const mealsMap = {};
        mealNames.forEach((mealName, index) => {
            const mealProtein = Math.round(targetMacros.protein / targetMealsPerDay);
            const mealFat = Math.round(targetMacros.fats / targetMealsPerDay);
            // The 40% Pre-Workout Performance Bias
            let mealCarbs = 0;
            if (mealName === "Pre-Workout") {
                mealCarbs = Math.round(targetMacros.carbs * 0.4);
            }
            else {
                const remainingCarbs = targetMacros.carbs * 0.6;
                mealCarbs = Math.round(remainingCarbs / (targetMealsPerDay - 1));
            }
            const pFood = proteinSources.length > 0
                ? proteinSources[index % proteinSources.length]
                : null;
            const cFood = carbSources.length > 0 ? carbSources[index % carbSources.length] : null;
            const fFood = fatSources.length > 0 ? fatSources[index % fatSources.length] : null;
            const mealItems = [];
            if (pFood) {
                const qty = Math.round((mealProtein / Math.max(1, pFood.protein)) * pFood.baseServingAmount);
                mealItems.push({ foodId: pFood._id, quantity: qty });
            }
            if (cFood) {
                const qty = Math.round((mealCarbs / Math.max(1, cFood.carbs)) * cFood.baseServingAmount);
                mealItems.push({ foodId: cFood._id, quantity: qty });
            }
            if (fFood) {
                const qty = Math.round((mealFat / Math.max(1, fFood.fats)) * fFood.baseServingAmount);
                mealItems.push({ foodId: fFood._id, quantity: qty });
            }
            mealsMap[mealName] = mealItems;
        });
        const customizedDietPlan = new CustomizedDietPlan({
            targetMealsPerDay,
            meals: new Map(Object.entries(mealsMap)),
        });
        await customizedDietPlan.save();
        return customizedDietPlan;
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof Error)
            throw new ApiError(500, [], error.message);
        return null;
    }
};
export const buildTrainingPlan = async (architecture) => {
    try {
        // 1. Fetch all available exercises for the engine to pick from
        // .lean() is critical here for performance since we only need the raw data
        const allExercises = await Exercise.find({}).lean();
        if (!allExercises || allExercises.length === 0) {
            throw new ApiError(400, [], "No exercises found in the database.");
        }
        // 2. Categorize the exercises into "Buckets" for easy selection
        const buckets = {
            upperCompound: allExercises.filter((e) => e.mechanic === "Compound" &&
                ["Chest", "Back", "Shoulders"].includes(e.targetMuscle)),
            upperIsolation: allExercises.filter((e) => e.mechanic === "Isolation" &&
                ["Chest", "Back", "Shoulders", "Arms"].includes(e.targetMuscle)),
            lowerCompound: allExercises.filter((e) => e.mechanic === "Compound" && e.targetMuscle === "Legs"),
            lowerIsolation: allExercises.filter((e) => e.mechanic === "Isolation" &&
                ["Legs", "Calves"].includes(e.targetMuscle)),
            fullBody: allExercises.filter((e) => e.mechanic === "Compound"),
            cardio: allExercises.filter((e) => e.mechanic === "Cardio" || e.type === "Cardio"),
        };
        // 3. Initialize the plain JavaScript Object to satisfy Mongoose Types.Map
        const scheduleMap = {};
        // Helper function to safely get an exercise and rotate the bucket
        const getExercise = (bucket) => {
            if (bucket.length === 0)
                return null;
            const exercise = bucket.shift(); // Take from the front
            bucket.push(exercise); // Push to the back for infinite rotation
            return exercise;
        };
        // 4. The 7-Day Template Interpreter Loop
        architecture.template.forEach((dayType, index) => {
            const dayKey = `Day ${index + 1}`;
            const dailyExercises = [];
            switch (dayType) {
                case "Upper":
                    for (let i = 0; i < 2; i++) {
                        const ex = getExercise(buckets.upperCompound);
                        if (ex)
                            dailyExercises.push({ exerciseId: ex._id, sets: 3, reps: 8 });
                    }
                    for (let i = 0; i < 2; i++) {
                        const ex = getExercise(buckets.upperIsolation);
                        if (ex)
                            dailyExercises.push({ exerciseId: ex._id, sets: 3, reps: 12 });
                    }
                    break;
                case "Lower":
                    for (let i = 0; i < 2; i++) {
                        const ex = getExercise(buckets.lowerCompound);
                        if (ex)
                            dailyExercises.push({ exerciseId: ex._id, sets: 3, reps: 8 });
                    }
                    for (let i = 0; i < 2; i++) {
                        const ex = getExercise(buckets.lowerIsolation);
                        if (ex)
                            dailyExercises.push({ exerciseId: ex._id, sets: 3, reps: 15 }); // Higher reps for legs
                    }
                    break;
                case "Full Body":
                    const fbUpper = getExercise(buckets.upperCompound);
                    const fbLower = getExercise(buckets.lowerCompound);
                    const fbIso = getExercise(buckets.upperIsolation);
                    if (fbUpper)
                        dailyExercises.push({ exerciseId: fbUpper._id, sets: 3, reps: 8 });
                    if (fbLower)
                        dailyExercises.push({ exerciseId: fbLower._id, sets: 3, reps: 8 });
                    if (fbIso)
                        dailyExercises.push({ exerciseId: fbIso._id, sets: 3, reps: 12 });
                    break;
                case "Cardio":
                    const cardioEx = getExercise(buckets.cardio);
                    // For cardio, 'sets' is 1 session, 'reps' denotes minutes
                    if (cardioEx)
                        dailyExercises.push({
                            exerciseId: cardioEx._id,
                            sets: 1,
                            reps: 30,
                        });
                    break;
                case "Rest":
                    // Leaves the array empty for a rest day
                    break;
            }
            // Assign the constructed daily array to the object key
            scheduleMap[dayKey] = dailyExercises;
        });
        // 5. Return the perfectly structured payload for the CustomizedPlan model
        const customizedTrainingPlan = new CustomizedTrainingPlan({
            splitName: architecture.splitName,
            trainingDaysPerWeek: architecture.totalDaysPerWeek,
            schedule: scheduleMap,
        });
        await customizedTrainingPlan.save();
        return customizedTrainingPlan;
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new ApiError(500, [], error.message);
        }
        return null;
    }
};
export const buildSupplementPlan = async (dietPreference) => {
    try {
        // 1. Fetch available baseline supplements
        const allSupplements = await Supplement.find({}).lean();
        if (!allSupplements || allSupplements.length === 0) {
            throw new ApiError(400, [], "No supplements found in the database");
        }
        // 2. Initialize the plain JavaScript Object to satisfy Mongoose Types.Map
        const scheduleMap = {};
        // Helper function to safely find a supplement by keyword in its name
        const findSupp = (keyword) => {
            return allSupplements.find((s) => s.name.toLowerCase().includes(keyword.toLowerCase()) ||
                s.category.toLowerCase().includes(keyword.toLowerCase()));
        };
        // Helper function to push to the Map safely
        const addToSchedule = (supplement, timingKey, doseQuantity = 1) => {
            if (!supplement)
                return;
            if (!scheduleMap[timingKey]) {
                scheduleMap[timingKey] = [];
            }
            scheduleMap[timingKey].push({
                supplementId: supplement._id,
                quantity: doseQuantity,
                time: timingKey,
            });
        };
        // 3. Conditional Allergy Logic (Virtual Coach Intelligence)
        // Check if the user has a dairy allergy to avoid assigning Whey Protein
        const hasDairyAllergy = dietPreference.allergies?.some((a) => a.toLowerCase().includes("dairy") || a.toLowerCase().includes("milk"));
        // 4. Assign Universal & Conditional Supplements to their Timing Slots
        // A. Post-Workout Stack (Creatine + Protein)
        const creatine = findSupp("creatine");
        addToSchedule(creatine, "post-workout", 1); // 1 standard dose (usually 5g)
        let proteinPowder = null;
        if (hasDairyAllergy) {
            proteinPowder = findSupp("plant") || findSupp("vegan");
        }
        else {
            proteinPowder = findSupp("whey");
        }
        addToSchedule(proteinPowder, "post-workout", 1);
        // B. Morning Health Stack (e.g., Omega-3 / Multivitamins)
        const omega3 = findSupp("omega") || findSupp("fish oil");
        addToSchedule(omega3, "after-breakfast", 1);
        // C. Sleep / Recovery Stack (e.g., Magnesium or Zinc)
        const magnesium = findSupp("magnesium");
        addToSchedule(magnesium, "before-sleep", 1);
        // 5. Return the structured payload
        const supplementPlan = new CustomizedSupplementPlan({
            schedule: scheduleMap,
        });
        await supplementPlan.save();
        return supplementPlan;
    }
    catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        else if (error instanceof Error) {
            throw new ApiError(500, [], error.message);
        }
        return null;
    }
};
//# sourceMappingURL=calculationEngine.utils.js.map