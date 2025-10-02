import mongoose, { Model, Schema } from "mongoose";
import DiffPlugin from "mongoose-history-diff";
import { IColor } from "../lib/interfaces";

const ColorSchema: Schema<IColor> = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true
    },
    colorCode: {
        type: String,
        required: false,
        // unique: true
    },
    imageUrl: {
        type: String,
        required: false
    }
  },
  { timestamps: true }
);

ColorSchema.plugin(DiffPlugin);

const ColorModel: Model<IColor> = mongoose.model(
  "Color",
  ColorSchema
);

export default ColorModel;
