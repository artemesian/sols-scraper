import mongoose, { Model, Schema } from "mongoose";
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

const CategoryModel: Model<ICategory> = mongoose.model(
  "Category",
  CategorySchema
);

export default CategoryModel;
