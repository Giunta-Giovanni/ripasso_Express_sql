// importiamo la connessione a mysql
const connection = require('../data/db')

// funzioni per operazioni crud

// index
function index(req, res) {
    // prepariamo la query
    const postSql = `
        SELECT*
        FROM posts
    `

    // eseguiamo la query
    connection.query(postSql, (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' })
        res.json(postResults);
    })
}

// show
function show

// destroy
function destroy(req, res) {
    const id = req.params.id
    //prepariamo la query
    const postsSql = `
    DELETE 
    FROM posts
    WHERE id = ?
    `
    // eliminiamo il post
    connection.query(postsSql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (err) return res.status(404).json({ error: 'post non trovato' });
        res.sendStatus(204);
    })
}
module.exports = { index, destroy }