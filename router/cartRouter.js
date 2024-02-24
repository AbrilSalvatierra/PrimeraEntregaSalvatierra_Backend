import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartRouter = express.Router();
const cartsFilePath = path.resolve(__dirname, 'C:\\Users\\salva\\OneDrive\\Escritorio\\Backend\\PrimeraEntregaSalvatierra\\data\\carts.json');
const productsFilePath = path.resolve(__dirname, 'C:\\Users\\salva\\OneDrive\\Escritorio\\Backend\\PrimeraEntregaSalvatierra\\data\\products.json');

//Funciones de los carritos
async function loadCartsFromFile() {
    try {
        const data = await fs.promises.readFile(cartsFilePath, 'utf8');
        const carts = JSON.parse(data);
        for (const cart of carts) {
            for (const product of cart.products) {
                const productDetails = await getProductDetails(product.id);
                if (productDetails) {
                    product.title = productDetails.title;
                    product.price = productDetails.price;
                    product.thumbnail = productDetails.thumbnail;
                }
            }
        }
        return carts;
    } catch (error) {
        if (error.code !== 'No such file') {
            throw new Error(`Upps something went wrong loading cart from the file: ${error.message}`);
        }
        return [];
    }
}

async function loadProductsFromFile() {
    try {
        const data = await fs.promises.readFile(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Upps something went wrong loading products from the file: ${error.message}`);
    }
}


async function saveCartsToFile(carts) {
    try {
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        throw new Error(`Upps something went wrong saving cart from t
        
        he file: ${error.message}`);
    }
}

// Rutas
cartRouter.post('/', async (req, res) => {
    try {
        const newCart = {
            id: Math.floor(Math.random() * 1000),
        };
        const carts = await loadCartsFromFile();
        await saveCartsToFile([...carts, newCart]);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const carts = await loadCartsFromFile();
        const cartId = parseInt(req.params.cid);
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await loadCartsFromFile();
        const products = await loadProductsFromFile();
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        // Verifica si el producto existe
        const productToAdd = products.find(product => product.id === productId);
        if (!productToAdd) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        const existingProductIndex = cart.products.findIndex(product => product.id === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ ...productToAdd, quantity: 1 });
        }

        await saveCartsToFile(carts);

        const addedProductDetails = cart.products.find(product => product.id === productId);
        res.status(201).json(addedProductDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default cartRouter;
