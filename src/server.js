// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Archivo para guardar los productos (simulando base de datos)
const PRODUCTOS_FILE = 'productos.json';

// Función para leer productos del archivo
function leerProductos() {
    try {
        if (fs.existsSync(PRODUCTOS_FILE)) {
            const data = fs.readFileSync(PRODUCTOS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error leyendo productos:', error);
    }
    return [];
}

// Función para guardar productos
function guardarProductos(productos) {
    try {
        fs.writeFileSync(PRODUCTOS_FILE, JSON.stringify(productos, null, 2));
        return true;
    } catch (error) {
        console.error('Error guardando productos:', error);
        return false;
    }
}

// RUTAS DEL API

// GET - Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const productos = leerProductos();
    console.log(`📦 Enviando ${productos.length} productos`);
    res.json(productos);
});

// GET - Obtener producto por ID
app.get('/api/productos/:id', (req, res) => {
    const productos = leerProductos();
    const producto = productos.find(p => p.id === req.params.id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
});

// POST - Crear nuevo producto
app.post('/api/productos', (req, res) => {
    const productos = leerProductos();
    const nuevoProducto = {
        id: req.body.id || Date.now().toString(), 
        ...req.body,
        fechaCreacion: new Date().toISOString()
    };
    
    productos.push(nuevoProducto);
    
    if (guardarProductos(productos)) {
        console.log('Producto creado:', nuevoProducto.name);
        res.status(201).json(nuevoProducto);
    } else {
        res.status(500).json({ error: 'Error guardando producto' });
    }
});
// PUT - Actualizar producto
app.put('/api/productos/:id', (req, res) => {
    const productos = leerProductos();
    const index = productos.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    productos[index] = { ...productos[index], ...req.body };

    if (guardarProductos(productos)) {
        console.log('✏️ Producto actualizado:', productos[index].name);
        res.json(productos[index]);
    } else {
        res.status(500).json({ error: 'Error actualizando producto' });
    }
});

// DELETE - Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    const productos = leerProductos();
    const index = productos.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productoEliminado = productos.splice(index, 1)[0];

    if (guardarProductos(productos)) {
        console.log(' Producto eliminado:', productoEliminado.name);
        res.json({ message: 'Producto eliminado', producto: productoEliminado });
    } else {
        res.status(500).json({ error: 'Error eliminando producto' });
    }
});

// Inicializar con datos de ejemplo si no existen
app.post('/api/inicializar', (req, res) => {
    const productosActuales = leerProductos();

    if (productosActuales.length === 0) {
        const productosIniciales = [
            // Tu lista completa de 83 productos aquí
            { id: "1", name: "Manzanas Rojas", precio: 990, categoria: "frutas", img: "img/Manzana/Manzana_1.png", desc: "Manzanas frescas, crocantes y dulces.", habilitado: true },
            { id: "2", name: "Naranjas", precio: 1500, categoria: "frutas", img: "img/Naranja/Naranja_1.png", desc: "Naranjas jugosas llenas de vitamina C.", habilitado: true },
            // ... agrega todos tus 83 productos
        ];

        if (guardarProductos(productosIniciales)) {
            console.log('🎉 Catálogo inicializado con', productosIniciales.length, 'productos');
            res.json({ message: 'Catálogo inicializado', total: productosIniciales.length });
        } else {
            res.status(500).json({ error: 'Error inicializando catálogo' });
        }
    } else {
        res.json({ message: 'Catálogo ya existe', total: productosActuales.length });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(` Servidor API ejecutándose en http://localhost:${PORT}`);
    console.log(`Endpoints disponibles:`);
    console.log(`   GET  http://localhost:${PORT}/api/productos`);
    console.log(`   POST http://localhost:${PORT}/api/productos`);
    console.log(`   PUT  http://localhost:${PORT}/api/productos/:id`);
    console.log(`   DEL  http://localhost:${PORT}/api/productos/:id`);
    console.log(`   POST http://localhost:${PORT}/api/inicializar`);
});