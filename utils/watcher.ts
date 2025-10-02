import scrapper from "./sols_scraper";
import ProductModel from "../models/product.model";
import SizeModel from "../models/size.model";
import CategoryModel from "../models/category.model";
import ProductBrandModel from "../models/productBrand.model";
import ProductFormatModel from "../models/productFormat.model";
import ColorModel from "../models/color.model";
import mongoose from "mongoose";
import connectDB from "../utils/db";
import { ISizeInProduct } from "../lib/interfaces";


function adaptScrapedData(scrapedInventory: any, categoryName: string, brandName: string, formatName: string) {
  return [{
    category: { title: categoryName },
    brand: { title: brandName },
    format: { title: formatName },
    inventory: scrapedInventory.map((inv: any) => ({
      color: { title: inv.color || "Unknown Color" },
      sizesInfo: inv.sizesInfo.map((sizeInfo: any) => ({
        size: { title: sizeInfo.sizeTitle || "Unknown Size" },  // You must define how to get size title here
        quantityAvailable: sizeInfo.quantity,
        image: sizeInfo.image,
        price: sizeInfo.price,
      }))
    }))
  }];
}

const saveData = async () => {
    let data: any = await scrapper();
    console.log(data[0].sizesInfo[0])
    data = adaptScrapedData(data, "T-Shirts", "Imperial", "Unisex");
    console.log(data)
   // if the category, brand, format, color or size does not exist, create it
    await connectDB();
    const Category = CategoryModel;
    const ProductBrand = ProductBrandModel;
    const ProductFormat = ProductFormatModel;
    const Color = ColorModel;
    const Size = SizeModel; 
    const Product = ProductModel;

    for (let item of data) {
        // check if category exists
        console.log("Checking if category exists:", item.category.title);
        let category = await Category.findOne({ title: item.category.title });
        if (!category) {
            category = new Category(item.category);
            await category.save();
        }
        item.category = category._id;
        // check if brand exists
        console.log("Checking if brand exists:", item.brand.title);
        let brand = await ProductBrand.findOne({ title: item.brand.title });
        if (!brand) {
            brand = new ProductBrand(item.brand);
            await brand.save();
        }
        item.brand = brand._id;
        // check if format exists
        console.log("Checking if format exists:", item.format.title);
        let format = await ProductFormat.findOne({ title: item.format.title });
        if (!format) {
            format = new ProductFormat(item.format);
            await format.save();
        }
        item.format = format._id;
        // for each inventory item, check if color exists
        console.log("Processing inventory ");
        for (let inventoryItem of item.inventory) {
            // console.log("Checking if color exists:", inventoryItem.color.title);
            let color = await Color.findOne({ title: inventoryItem.color.title });
            if (!color) {
                color = new Color(inventoryItem.color);
                await color.save();
            }
            inventoryItem.color = color._id;
            // for each size, check if size exists
            for (let sizeItem of inventoryItem.sizesInfo) {
                // console.log("Checking if size exists:", sizeItem.size.title);
                let size = await Size.findOne({ title: sizeItem.size.title });
                if (!size) {
                    size = new Size({ title: sizeItem.size.title });
                    await size.save();
                }
                sizeItem.size = size._id;
            }
        }
    // now save the products
    console.log("Saving products...");
        let product = await Product.findOne({
            category: item.category,
            brand: item.brand,
            format: item.format,
        }); 
        let finalInventory = item.inventory.map((inv: any) => ({
            color: inv.color,
            sizes: inv.sizesInfo.map((sizeInfo: any) => ({
                size: sizeInfo.size,
                quantityAvailable: sizeInfo.quantityAvailable,
                price: sizeInfo.price,
            })),
        }));
        
        if (!product) {
            product = new Product({
                category: item.category,
                brand: item.brand,
                format: item.format,
                inventory: finalInventory,
            });
            await product.save();
        } else {
            console.log("Product already exists, updating inventory...");
            await product.updateOne({
                $set: {
                    inventory: finalInventory,
                }
            });
        }
    }
    await mongoose.connection.close();
    console.log("Data saved successfully");
    return data;
};

export default saveData;