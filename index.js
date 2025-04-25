import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import { dbConnection } from './Database/db.js';
import productRouter from './src/Routes/products/productRoute.js';
import seedData from './seedData.js';
import favRouter from './src/Routes/fav/favRoute.js';
import cartRouter from './src/Routes/cart/CartRoute.js'
const app = express();
const port = 80;
dotenv.config();
app.use(cors());
app.use(express.json())

app.use("/api/products", productRouter);
app.use("/api/fav", favRouter);
app.use("/api/cart", cartRouter);

dbConnection();

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));
