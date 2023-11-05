require('dotenv').config()
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')

const config = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    allowExitOnIdle: true
}

const pool = new Pool(config)

const genericSqlQuery = async (query = '', values = []) => {
    try {
        const { rows } = await pool.query(query, values);
        return rows;
    } catch (error) {
        return { code: error.code, message: error.message };
    }
}

const leerPosts = async () => {
    return await genericSqlQuery('SELECT * FROM posts;');
}

const crearPost = async ({ titulo, url: img, descripcion }) => {
    const query = 'INSERT INTO posts(id, titulo, img, descripcion) VALUES ($1, $2, $3, $4);'
    const values = [uuidv4(), titulo, img, descripcion]
    return await genericSqlQuery(query, values);
}

const actualizarPost = async (id, { titulo, url: img, descripcion }) => {
    const query = 'UPDATE posts set titulo = $2, img = $3, descripcion = $4 WHERE id = $1 RETURNING *;'
    const values = [id, titulo, img, descripcion]
    return await genericSqlQuery(query, values);
}

const eliminarPost = async (id) => {
    return await genericSqlQuery('DELETE FROM posts WHERE id = $1 RETURNING *;', [id]);
}

const actualizarLike = async (id) => {
    const query = `UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *;`
    return await genericSqlQuery(query, [id]);
}

module.exports = {
    leerPosts,
    crearPost,
    actualizarPost,
    eliminarPost,
    actualizarLike
}
