import express from "express";
import { addToFavorites, editFavoriteProductQuantity, getFavProducts, removeFromFavorites } from "./favController.js";
const favRouter = express.Router();
favRouter.get('/', getFavProducts);
favRouter.post('/add', addToFavorites);
favRouter.post('/add', addToFavorites);
favRouter.put('/update-quantity', editFavoriteProductQuantity);
favRouter.delete('/remove/:productId', removeFromFavorites);
export default favRouter;