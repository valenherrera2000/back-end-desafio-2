const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = process.env.PORT || 3000;

const productManager = new ProductManager('products.json');

app.use(express.json());

app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (!isNaN(limit)) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
