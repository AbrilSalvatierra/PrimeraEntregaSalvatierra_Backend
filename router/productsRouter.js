import express from 'express';
import ProductManager from '../src/ProductManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager('C:\\Users\\salva\\OneDrive\\Escritorio\\Backend\\PrimeraEntregaSalvatierra\\data\\products.json');


productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        let products = await productManager.getProducts();
        if (limit !== null && !isNaN(limit)) {
            products = products.slice(0, limit);
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Sorry, the product you are looking for does not exist' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const productId = await productManager.addProduct(req.body);
        res.status(201).json({ id: productId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productManager.updateProduct(productId, req.body);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productsRouter.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productManager.deleteProduct(productId);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;
