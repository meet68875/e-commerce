import Favorites from "../../../Database/models/fav.js";
import Product from "../../../Database/models/product.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FavoriteProduct:
 *       type: object
 *       properties:
 *         product:
 *           type: object
 *           description: The product details
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 * 
 *     Favorite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FavoriteProduct'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Managing favorite products
 */

// ========================== Get Favorites ==========================
/**
 * @swagger
 * /api/fav:
 *   get:
 *     summary: Get all favorite products
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Successfully retrieved favorite products
 *       404:
 *         description: No favorites found
 *       500:
 *         description: Server error
 */
export const getFavProducts = async (req, res) => {
  try {
    const favorites = await Favorites.find().populate('products.product');
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========================== Add to Favorites ==========================
/**
 * @swagger
 * /api/fav/add:
 *   post:
 *     summary: Add a product to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product (optional, default 1)
 *     responses:
 *       200:
 *         description: Product added to favorites
 *       400:
 *         description: Missing product ID or insufficient stock
 *       409:
 *         description: Product already in favorites
 *       500:
 *         description: Server error
 */
export const addToFavorites = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let favorite = await Favorites.findOne();

    if (!favorite) {
      favorite = new Favorites({
        products: [{ product: productId, quantity }],
      });
    } else {
      const exists = favorite.products.find(
        (item) => item.product.toString() === productId
      );

      if (exists) {
        return res.status(409).json({ message: "Product already in favorites" });
      }

      favorite.products.push({ product: productId, quantity });
    }

    await favorite.save();

    res.status(200).json({ message: "Product added to favorites", data: favorite });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ========================== Edit Favorite Quantity ==========================
/**
 * @swagger
 * /api/fav/edit-quantity:
 *   put:
 *     summary: Update quantity of a product in favorites
 *     tags: [Favorites]
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
 *         description: Product quantity updated
 *       400:
 *         description: Missing product ID or quantity
 *       404:
 *         description: Product not found in favorites
 *       500:
 *         description: Server error
 */
export const editFavoriteProductQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    const favorite = await Favorites.findOne();

    if (!favorite) {
      return res.status(404).json({ message: "Favorites not found" });
    }

    const productItem = favorite.products.find(
      (item) => item.product.toString() === productId
    );

    if (!productItem) {
      return res.status(404).json({ message: "Product not found in favorites" });
    }

    productItem.quantity = quantity;
    await favorite.save();

    res.status(200).json({ message: "Product quantity updated", data: favorite });
  } catch (error) {
    console.error("Error updating favorite quantity:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ========================== Remove from Favorites ==========================
/**
 * @swagger
 * /api/fav/remove/{productId}:
 *   delete:
 *     summary: Remove a product from favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed from favorites
 *       404:
 *         description: Product not found in favorites
 *       500:
 *         description: Server error
 */
export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    const favorite = await Favorites.findOne();

    if (!favorite) {
      return res.status(404).json({ message: "Favorites list not found" });
    }

    const initialLength = favorite.products.length;

    favorite.products = favorite.products.filter(
      (item) => item.product.toString() !== productId
    );

    if (favorite.products.length === initialLength) {
      return res.status(404).json({ message: "Product not found in favorites" });
    }

    await favorite.save();

    res.status(200).json({ message: "Product removed from favorites", data: favorite });
  } catch (error) {
    console.error("Error removing product from favorites:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
