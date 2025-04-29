// CartController.js 
import Cart from "../../../Database/models/cart.js";
import Product from "../../../Database/models/product.js";
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ products: [{ product: productId, quantity }] });
    } else {
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (existingProductIndex > -1) {
        const newQuantity = cart.products[existingProductIndex].quantity + quantity;
        if (product.quantity < newQuantity) {
          return res.status(400).json({ message: "Exceeds available stock." });
        }
        cart.products[existingProductIndex].quantity = newQuantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json({ message: "Product added to cart successfully!" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
export const getCartProducts = async (req, res) => {
    try {
      const cart = await Cart.findOne().populate("products.product");
      if (!cart || cart.products.length === 0) {
        return res.status(200).json({ products: [] });
      }
      const formattedProducts = cart.products.map(item => ({
        product: item.product, 
        quantity: item.quantity
      }));
      res.status(200).json({ products: formattedProducts });
    } catch (error) {
      console.error("Error fetching cart products:", error);
      res.status(500).json({ message: "Server error", error });
    }
};

export const updateCartProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const productItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!productItem) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    productItem.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: "Cart product updated successfully", data: cart });
  } catch (err) {
    console.error("Error updating cart product:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully", data: cart });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};