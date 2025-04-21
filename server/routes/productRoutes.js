import express from 'express'
import { getProducts, updateDB } from '../controller/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';
export const productRouter = express.Router();

productRouter.get("/search", getProducts);
productRouter.put("/reduce", authenticate, updateDB);