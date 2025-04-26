import Product from './Database/models/product.js';
import Cart from './Database/models/cart.js';
import Favorites from './Database/models/fav.js';
import Category from './Database/models/category.js'; // Import Category model

const seedData = async () => {
  try {
    console.log('Seeding process started...');

    // Step 1: Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Favorites.deleteMany({});
    console.log('Existing data cleared!');

    // Step 2: Insert categories
    const categories = [
      { name: 'Electronics', description: 'Devices like mobiles, laptops, and accessories' },
      { name: 'Clothing', description: 'Fashion items like shirts, pants, and jackets' },
      { name: 'Home Appliances', description: 'Appliances for daily household needs' },
      { name: 'Books', description: 'Fiction, non-fiction, and educational materials' }
    ];

    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories seeded successfully!');

    const categoryMap = insertedCategories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    // Step 3: Insert products
    const products = [
      { name: 'iPhone 15', price: 999, category: categoryMap['Electronics'], description: 'Latest Apple iPhone 15', quantity: 10 },
      { name: 'Dell XPS 15', price: 1500, category: categoryMap['Electronics'], description: 'High performance laptop', quantity: 5 },
      { name: 'Men\'s T-shirt', price: 25, category: categoryMap['Clothing'], description: 'Comfortable cotton t-shirt', quantity: 50 },
      { name: 'Women\'s Jacket', price: 120, category: categoryMap['Clothing'], description: 'Stylish winter jacket', quantity: 20 },
      { name: 'Microwave Oven', price: 300, category: categoryMap['Home Appliances'], description: '800W microwave oven', quantity: 15 },
      { name: 'The Great Gatsby', price: 15, category: categoryMap['Books'], description: 'Classic novel by F. Scott Fitzgerald', quantity: 30 },
    ];

    const insertedProducts = await Product.insertMany(products);
    console.log('Products seeded successfully!');

    const productMap = insertedProducts.reduce((acc, product) => {
      acc[product.name] = product._id;
      return acc;
    }, {});

    // Step 4: Insert cart data
    const cart = [
      { product: productMap['iPhone 15'], quantity: 1 },
      { product: productMap['Men\'s T-shirt'], quantity: 3 },
    ];

    await Cart.insertMany([{ userId: 'user1', products: cart }]);
    console.log('Cart data seeded successfully!');

    // Step 5: Insert favorites data
    const favorites = [
      { product: productMap['Women\'s Jacket'] },
      { product: productMap['Dell XPS 15'] },
    ];

    await Favorites.insertMany([{ userId: 'user1', products: favorites }]);
    console.log('Favorites data seeded successfully!');

    console.log('✅ All data seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
};

export default seedData;
