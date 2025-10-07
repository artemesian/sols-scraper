import mongoose, { Model, Schema } from "mongoose";
import { IProductBrand } from "../lib/interfaces";

const ProductBrandSchema: Schema<IProductBrand> = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        unique: true
    }
  },
  { timestamps: true }
);

const ProductBrandModel: Model<IProductBrand> = mongoose.model(
  "ProductBrand",
  ProductBrandSchema
);

export default ProductBrandModel;
