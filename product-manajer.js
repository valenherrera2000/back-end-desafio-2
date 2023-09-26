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

// Ejemplo de uso:
const productManager = new ProductManager('products.json');

(async () => {
    // Agregar un producto
    const newProduct = await productManager.addProduct({
        title: 'Producto 1',
        description: 'Descripción del Producto 1',
        price: 19.99,
        thumbnail: 'imagen1.jpg',
        code: 'P1',
        stock: 10,
    });
    console.log('Producto agregado:', newProduct);

    // Obtener todos los productos
    const allProducts = await productManager.getProducts();
    console.log('Todos los productos:', allProducts);

    // Obtener un producto por ID
    const productById = await productManager.getProductById(1);
    console.log('Producto por ID:', productById);

    // Actualizar un producto por ID
    const updatedProduct = await productManager.updateProduct(1, {
        price: 24.99,
        stock: 15,
    });
    console.log('Producto actualizado:', updatedProduct);

    // Eliminar un producto por ID
    const deleted = await productManager.deleteProduct(1);
    console.log('Producto eliminado:', deleted);

    // Obtener todos los productos actualizados
    const updatedProducts = await productManager.getProducts();
    console.log('Productos actualizados:', updatedProducts);
})();
