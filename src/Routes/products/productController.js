import Category from "../../../Database/models/category.js";
import Product from "../../../Database/models/product.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("categories",categories);
    
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category  });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category.' });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, quantity } = req.body;

  if (!name || !price || !category || quantity === undefined) {
    return res.status(400).json({ message: 'Name, price, category, and quantity are required.' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category, description, quantity },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


  export const createProduct = async (req, res) => {
    const { name, price, category, description, quantity } = req.body;
  
    if (!name || !price || !category || quantity === undefined) {
      return res.status(400).json({ message: "Name, price, category, and quantity are required." });
    }
  
    try {
      const newProduct = new Product({
        name,
        price,
        category,
        description,
        quantity,
      });
  
      await newProduct.save();
  
      res.status(201).json({ message: "Product created successfully", data: newProduct });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  };
    



  export const deleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  };