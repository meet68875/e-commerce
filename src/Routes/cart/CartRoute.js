// CartRoute.js
import express from "express";
import { addToCart, getCartProducts, removeFromCart, updateCartProduct } from "./CartController.js";
const cartRouter = express.Router();
cartRouter.post("/", addToCart);
cartRouter.get("/", getCartProducts);
cartRouter.put('/update', updateCartProduct);
cartRouter.delete('/remove/:productId', removeFromCart);
export default cartRouter;

