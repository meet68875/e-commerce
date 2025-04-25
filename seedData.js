import Product from './Database/models/product.js';
import Cart from './Database/models/cart.js';
import Favorites from './Database/models/fav.js';
import Category from './Database/models/category.js';  // Import Category model
const seedData = async () => {
  // Static data for categories
  const categories = [
    { name: 'Electronics', description: 'Electronics products like mobiles, computers, etc.' },
    { name: 'Clothing', description: 'Apparel products like shirts, pants, etc.' },
  ];
  // Insert categories into the database
  await Category.deleteMany({});
  const insertedCategories = await Category.insertMany(categories);
  console.log('Category data seeded successfully!');
  const categoryMap = insertedCategories.reduce((acc, category) => {
    acc[category.name] = category._id;
    return acc;
  }, {});
  const products = [
    { name: 'Product 1', price: 100, category: categoryMap['Electronics'], description: 'Description for Product 1' },
    { name: 'Product 2', price: 200, category: categoryMap['Clothing'], description: 'Description for Product 2' },
    { name: 'Product 3', price: 300, category: categoryMap['Electronics'], description: 'Description for Product 3' },
    { name: 'Product 4', price: 150, category: categoryMap['Clothing'], description: 'Description for Product 4' },
  ];

  // Insert products into the database
  await Product.deleteMany({});
  const insertedProducts = await Product.insertMany(products);
  console.log('Product data seeded successfully!');
  const productMap = insertedProducts.reduce((acc, product) => {
    acc[product.name] = product._id;
    return acc;
  }, {});
  const cart = [
    { product: productMap['Product 1'], quantity: 2 },
    { product: productMap['Product 3'], quantity: 1 },
  ];
  // Insert cart data (for a specific user)
  await Cart.deleteMany({});
  await Cart.insertMany([{ products: cart }]);
  console.log('Cart data seeded successfully!');
  const favorites = [
    { product: productMap['Product 2'] },
    { product: productMap['Product 4'] },
  ];
  // Insert favorites data (for a specific user)
  await Favorites.deleteMany({});
  await Favorites.insertMany([{ userId: 'user1', products: favorites }]);
  console.log('Favorites data seeded successfully!');
};
export default seedData;

  