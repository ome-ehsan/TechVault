import express from 'express'
const productRouter = express.Router();

productRouter.get("/product/search", getProducts);
