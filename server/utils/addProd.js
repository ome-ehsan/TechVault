import { Product } from '../model/productModel.js';
import { gpuData } from './prodData.js';

export async function addProductsToDB(productsData) {
    try {
        const productPromises = productsData.map(async (productData) => {
            const product = new Product(productData);
            return await product.save();
        });
        const addedProducts = await Promise.all(productPromises);

        console.log("Products added successfully:", addedProducts);
        return addedProducts;
    } catch (error) {
        console.error("Error adding products to DB:", error);
        throw error;
    }
}

