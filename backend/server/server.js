require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { leerPosts, crearPost, actualizarPost, eliminarPost, actualizarLike } = require('../utils/pg')

const PORT = process.env.PORT ?? 3001
const app = express()

app.use(cors())
app.use(express.json())

app.get('/posts', async (req, res) => {
    try {
        const posts = await leerPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/posts', async (req, res) => {
    const { titulo, url, descripcion } = req.body;
    try {
        const posts = await crearPost({ titulo, url, descripcion });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.put('/posts/:id', async (req, res) => {
    try {
        const result = await actualizarPost(req.params.id, req.body);
        res.status(result?.code ? 500 : 200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.delete('/posts/:id', async (req, res) => {
    try {
        const result = await eliminarPost(req.params.id);
        res.status(result?.code ? 500 : 200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.put('/posts/like/:id', async (req, res) => {
    try {
        const result = await actualizarLike(req.params.id);
        res.status(result?.code ? 500 : 200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'La ruta no existe' }))

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
