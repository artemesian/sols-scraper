require("dotenv").config();
import mongoose from "mongoose";

export interface ICategory extends mongoose.Document {
  title: string;
}

export interface IProductBrand extends mongoose.Document {
  title: string;
}

export interface IProductFormat extends mongoose.Document {
  title: string;
}

export interface IColor extends mongoose.Document {
  title: string;
  colorCode: string;
  imageUrl?: string;
}

export interface ISize extends mongoose.Document {
  title: string;
}

export interface ISizeInProduct extends mongoose.Document {
  size: ISize;
  quantityAvailable: number;
  price: number;
}

export interface IProduct extends mongoose.Document {
  category: ICategory;
  brand: IProductBrand;
  format: IProductFormat;
  inventory: Array<{
    color: IColor;
    sizes: Array<ISizeInProduct>;
  }>;
  history: Array<{
    date: Date;
    inventory: Array<{
      color: IColor;
      sizes: Array<ISizeInProduct>;
    }>;
  }>;
}