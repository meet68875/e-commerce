import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, updateProduct } from "./productController.js";
const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/category/:category', getProductsByCategory);
productRouter.post('/create', createProduct);
productRouter.put('/update/:id', updateProduct);
productRouter.delete('/delete/:id', deleteProduct); 
export default productRouter;
//AppError.js
export class AppError extends Error {
    constructor(message, statuscode) {
      super(message);
      this.statuscode = statuscode;
    }
  }