import mongoose, { Model, Schema } from "mongoose";
import DiffPlugin from "mongoose-history-diff";
import { ISize } from "../lib/interfaces";

const SizeSchema: Schema<ISize> = new mongoose.Schema<ISize>(
  {
    title: {
        type: String,
        required: true,
        unique: true
    },
  },
  { timestamps: true }
);

SizeSchema.plugin(DiffPlugin);

const SizeModel: Model<ISize> = mongoose.model(
  "Size",
  SizeSchema
);

export default SizeModel;
