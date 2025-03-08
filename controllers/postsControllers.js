// importiamo la connessione a mysql
const connection = require('../data/db')
const { post } = require('../routes/postsRouter')

// funzioni per operazioni crud

// index
function index(req, res) {
    // prepariamo la query
    const postSql = `
        SELECT*
        FROM posts
    `
    connection.query(postSql, (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(postResults)
    })
}

// show
function show(req, res) {
    // salviamo l'id dalla richiesta
    const { id } = req.params
    // salviamo la query sql dei posts
    const postSql = `
        SELECT*
        FROM posts
        WHERE id = ?
    `
    const tagSql = `
    SELECT*
    FROM tags
    JOIN post_tag ON tags.id = post_tag.tag_id
    WHERE post_id = ?
    `
    // salviamo la query sql dei tags

    // tramite query ci troviamo il singolo post
    // eseguiamo la query
    connection.query(postSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({ error: 'Database query failed' })
        if (postResults.length === 0) return res.status(404).json({ error: 'post non trovato' });
        // recuperiamo il post
        const post = postResults[0];

        connection.query(tagSql, [id], (err, tagsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' })
            if (postResults.length === 0) return res.status(404).json({ error: 'post non trovato' });
            // inseriamo i tags nei posts
            post.tags = tagsResults[0]
            res.json(post)
        })
    })
}

// posts
function store(req, res) {

    const { title, content, image } = req.body

    const addPostSql = `
        INSERT INTO posts(title, content, image)
        VALUES(?,?,?)
    `
    connection.query(addPostSql, [title, content, image], (err, Results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' })
        if (Results.length === 0) return res.status(404).json({ error: 'post non trovato' });
        res.json(Results[0]);
    }

    )

}
//update
function update(req, res) {

    const { id } = req.params
    const { title, content, image } = req.body

    const addPostSql = `
        UPDATE posts
        SET 
        title = ?,
        content = ?,
        image = ?
        WHERE id= ?
    `
    connection.query(addPostSql, [title, content, image, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' })
        if (results.affectedRows === 0) return res.status(404).json({ error: 'post non trovato' });
        res.json(results[0]);
    })
}
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
module.exports = { index, show, store, update, destroy }