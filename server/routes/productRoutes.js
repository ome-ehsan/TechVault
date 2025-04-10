import express from 'express'
import { getProducts } from '../controller/productController.js';
export const productRouter = express.Router();

productRouter.get("/search", getProducts);
