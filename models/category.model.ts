import mongoose, { Model, Schema } from "mongoose";
import DiffPlugin from "mongoose-history-diff";
import { ICategory } from "../lib/interfaces";

const CategorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        unique: true
    }
  },
  { timestamps: true }
);

CategorySchema.plugin(DiffPlugin);

const CategoryModel: Model<ICategory> = mongoose.model(
  "Category",
  CategorySchema
);

export default CategoryModel;
