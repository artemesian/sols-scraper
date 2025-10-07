import { IProduct } from "../lib/interfaces";
import ProductModel from "../models/product.model";
import { Request, Response, NextFunction } from "express";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products: Array<IProduct> = await ProductModel.find().populate('category brand format').populate('inventory.color inventory.sizes.size').populate('history.inventory.color history.inventory.sizes.size')
        return res.status(200).json({
            message: products
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
