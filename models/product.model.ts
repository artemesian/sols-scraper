import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "../lib/interfaces";

const ProductSchema: Schema<IProduct> = new mongoose.Schema(
  {
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, 
        ref: "Category"
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ProductBrand"
    },
    format: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "ProductFormat"
    },
    inventory: [
        {
            color: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Color"
            },
            sizes: [
                {
                    size: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "Size"
                    },
                    quantityAvailable: {
                        type: Number,
                        required: false
                    },
                    price: {
                        type: Number,
                        required: false
                    }
                }
            ]
        }
    ],
    history: [
        {
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            inventory: [ 
                {
                    color: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "Color"
                    },
                    sizes: [
                        {
                            size: {
                                type: mongoose.Schema.Types.ObjectId,
                                required: true,
                                ref: "Size"
                            },
                            quantityAvailable: {
                                type: Number,
                                required: false
                            },
                            price: {
                                type: Number,
                                required: false
                            }
                        }
                    ]
                }
            ],   
        },
    ],
  },
  { timestamps: true }
);

const ProductModel: Model<IProduct> = mongoose.model(
  "Product",
  ProductSchema
);

export default ProductModel;
