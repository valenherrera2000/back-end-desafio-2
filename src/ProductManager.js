const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: this.getNextId(products),
            ...product,
        };
        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((product) => product.id === id);
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct, id };
            await this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await this.saveProducts(products);
            return true;
        }
        return false;
    }

    getNextId(products) {
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }

    async saveProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}


module.exports = ProductManager;