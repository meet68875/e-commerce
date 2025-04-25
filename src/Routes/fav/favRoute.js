import express from "express";
import { addToFavorites, editFavoriteProductQuantity, getFavProducts, removeFromFavorites } from "./favController.js";
const favRouter = express.Router();
favRouter.get('/', getFavProducts);
favRouter.post('/add', addToFavorites);
favRouter.post('/add', addToFavorites);
router.put('/update-quantity', editFavoriteProductQuantity);
router.delete('/remove/:productId', removeFromFavorites);
export default favRouter;