import { Schema, model,Document,Types } from "mongoose";

export interface IadhocFood {
  foodId: Types.ObjectId;
  quantity: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Idietlog {
  plannedItemsChecked: Types.Map<boolean>;
  adHocFoods: IadhocFood[];
  liveMacroTotal: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}


export interface Iworkout {
  isRestDay: boolean;
  exercisesCompleted: Types.Map<boolean>;
  
}

export interface IdailyLog extends Document {
  userId: Types.ObjectId;
  dateString: string;
  isFinalized: boolean;
  morningWeight: number;
  dietLog: Idietlog;
  workoutLog: Iworkout;
  supplementLog: Types.Map<boolean>;

}

const dailyLogSchema = new Schema<IdailyLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateString: {
    type: String,
    required: true,
    index: true,
  },
  isFinalized: {
    type: Boolean,
    default: false,
  },
  morningWeight: {
    type: Number,
    required: true,
  },
  dietLog: {
    plannedItemsChecked: {
      type: Map,
      of: Boolean,
      default: {},
    },
    adHocFoods: [
      {
        foodId: {
          type: Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        macros: {
          protein: { type: Number },
          carbs: { type: Number },
          fat: { type: Number },
        },
      },
    ],
    liveMacroTotal: {
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
    },
  },

  workoutLog: {
    isRestDay: {
      type: Boolean,
      default: false,
    },
    exercisesCompleted: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  supplementLog: {
    type: Map,
    of: Boolean,
    default: {},
  },
});

export const DailyLog = model<IdailyLog>("DailyLog", dailyLogSchema);
