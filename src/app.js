import express from 'express';
import productsRouter from '../router/productsRouter.js';
import cartRouter from '../router/cartRouter.js';
import path from "path";
import { fileURLToPath } from 'url';
import ProductManager from './ProductManager.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;
const productsFilePath = 'C:\\Users\\salva\\OneDrive\\Escritorio\\Backend\\PrimeraEntregaSalvatierra\\data\\products.json';
const productManager = new ProductManager(productsFilePath); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
