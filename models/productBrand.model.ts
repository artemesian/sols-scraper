import mongoose, { Model, Schema } from "mongoose";
import DiffPlugin from "mongoose-history-diff";
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

ProductBrandSchema.plugin(DiffPlugin);

const ProductBrandModel: Model<IProductBrand> = mongoose.model(
  "ProductBrand",
  ProductBrandSchema
);

export default ProductBrandModel;
