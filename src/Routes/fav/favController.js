// favController.js
import Favorites from "../../../Database/models/fav.js";
import Product from '../../../Database/models/product.js';
export const getFavProducts = async (req, res) => {
    try {
      const favoritesWithProductDetails = await Favorites.aggregate([
        {
          $unwind: "$products"
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product", 
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails"
        },
        {
          $group: {
            _id: "$_id", 
            products: { $push: { product: "$productDetails", quantity: "$products.quantity" } }, // Reassemble the favorite data with product details
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" }
          }
        }
      ]);
      if (!favoritesWithProductDetails || favoritesWithProductDetails.length === 0) {
        return res.status(404).json({ message: "No favorite products found" });
      }
      res.status(200).json(favoritesWithProductDetails[0]);
    } catch (err) {
      console.error('Error fetching favorite products:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  };

  export const addToFavorites = async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      let favorite = await Favorites.findOne();
  
      if (!favorite) {
        favorite = new Favorites({
          products: [{ product: productId, quantity }]
        });
      } else {
        const alreadyExists = favorite.products.some(
          (item) => item.product.toString() === productId
        );
  
        if (alreadyExists) {
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
      console.error("Error updating product quantity in favorites:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  export const removeFromFavorites = async (req, res) => {
    const { productId } = req.params;
  
    try {
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