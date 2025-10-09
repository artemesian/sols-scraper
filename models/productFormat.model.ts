import mongoose, { Model, Schema } from "mongoose";
import { IProductFormat } from "../lib/interfaces";

const ProductFormatSchema: Schema<IProductFormat> = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        unique: true
    }
  },
  { timestamps: true }
);

const ProductFormatModel: Model<IProductFormat> = mongoose.model(
  "ProductFormat",
  ProductFormatSchema
);

export default ProductFormatModel;
