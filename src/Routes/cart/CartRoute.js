// CartRoute.js
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       400:
 *         description: Product ID and quantity are required
 *       500:
 *         description: Server error
 */

import express from "express";
import {
  addToCart,
  getCartProducts,
  removeFromCart,
  updateCartProduct,
} from "./CartController.js";
const cartRouter = express.Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       400:
 *         description: Product ID and quantity are required
 *       500:
 *         description: Server error
 */

cartRouter.post("/", addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all products in the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of cart products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Server error
 */

cartRouter.get("/", getCartProducts);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart product updated successfully
 *       400:
 *         description: Product ID and quantity are required
 *       404:
 *         description: Cart or Product not found
 *       500:
 *         description: Server error
 */

cartRouter.put("/update", updateCartProduct);

/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Cart or Product not found
 *       500:
 *         description: Server error
 */

cartRouter.delete("/remove/:productId", removeFromCart);
export default cartRouter;
