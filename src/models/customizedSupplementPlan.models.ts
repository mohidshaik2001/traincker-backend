import { model, Schema, Types ,Document} from "mongoose";

export type timing ="before-breakfast" |
              "after-breakfast"| 
              "before-lunch"|
              "after-lunch"|
              "before-dinner"|
              "after-dinner"|
              "pre-workout"|
              "post-workout"|
              "before-sleep";

  
export interface Supplement{
  supplementId:Types.ObjectId,
  quantity:number,
  time:timing
}

export interface ICustomizedSupplementPlan extends Document{
  schedule:Types.Map<Supplement[]>
}

const customizedSupplementPlanSchema = new Schema<ICustomizedSupplementPlan>(
  {
    schedule: {
      type: Map,
      of: [
        {
          supplementId: {
            type: Schema.Types.ObjectId,
            ref: "Supplement",
            required: true,
          },
          quantity: { type: Number, required: true },
          time: {
            type: String,
            enum: [
              "before-breakfast",
              "after-breakfast",
              "before-lunch",
              "after-lunch",
              "before-dinner",
              "after-dinner",
              "pre-workout",
              "post-workout",
              "before-sleep",
            ],
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true },
);

export const CustomizedSupplementPlan = model<ICustomizedSupplementPlan>(
  "CustomizedSupplementPlan",
  customizedSupplementPlanSchema,
);
