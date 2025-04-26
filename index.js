

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { dbConnection } from './Database/db.js';
import productRouter from './src/Routes/products/productRoute.js';
import seedData from './seedData.js';
import favRouter from './src/Routes/fav/favRoute.js';
import cartRouter from './src/Routes/cart/CartRoute.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json())
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'E-commerce API',
        version: '1.0.0',
        description: 'Backend API for e-commerce website',
      },
    },
    apis: ['./src/Routes/**/*.js'],
  };
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
  

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/products", productRouter);
app.use("/api/fav", favRouter);
app.use("/api/cart", cartRouter);

dbConnection();

// Important! Should listen on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

