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
    const id = parseInt(req.params.id);
    const { title, content, image, tags } = req.body; // tags può contenere sia ID numerici che stringhe

    // Query per aggiornare il post
    const sqlUpdatePost = `
        UPDATE posts 
        SET title = ?, content = ?, image = ?
        WHERE id = ?;
    `

    connection.query(sqlUpdatePost, [title, content, image, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Post non trovato' });

        if (!tags || tags.length === 0) {
            return res.json({ message: 'Post aggiornato con successo', id });
        }
        // Eliminare i vecchi tag associati al post
        const sqlDeleteTags = 'DELETE FROM post_tag WHERE postid = ?';
        connection.query(sqlDeleteTags, [id], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update tags' });

            // Separiamo i tag in ID esistenti e nuovi tag da creare
            const existingTagIds = [];
            const newTags = [];

            tags.forEach(tag => {
                if (typeof tag === 'number') {
                    existingTagIds.push(tag); // È un ID, lo usiamo direttamente
                } else if (typeof tag === 'string') {
                    newTags.push(tag); // È un nuovo nome di tag, dobbiamo crearlo
                }
            });

            // Se ci sono nuovi tag, li inseriamo
            if (newTags.length > 0) {
                const sqlInsertNewTags = 'INSERT INTO tags (label) VALUES ?';
                const tagValues = newTags.map(tag => [tag]);

                connection.query(sqlInsertNewTags, [tagValues], (err, result) => {
                    if (err) return res.status(500).json({ error: 'Failed to insert new tags' });

                    // Recuperiamo i nuovi ID generati
                    const newTagIds = Array.from({ length: result.affectedRows }, (_, i) => result.insertId + i);

                    // Combiniamo i nuovi tag con quelli già esistenti
                    const allTagIds = [...existingTagIds, ...newTagIds];

                    insertTagsIntoPost(id, allTagIds, res);
                });
            } else {
                // Se non ci sono nuovi tag, usiamo solo quelli esistenti
                insertTagsIntoPost(id, existingTagIds, res);
            }
        });
    });
}

//modify
function modify(req, res) {
    // ricaviamoci l'id
    const id = req.params.id

    // ricaviamoci i dati delle colonne
    const { title, content, image } = req.body;

    // creiamo due array vuoti per raccogliere i campi ed aggiornare i relativi valori 
    const updateFields = [];
    const updateValues = []

    // verifichiamo se i campi sono definiti alla richiesta e in caso positivo lo aggiungiamo alla lista dei campi da aggiornare con il relativo valore
    if (title !== undefined) {
        updateFields.push("title = ?")
        updateValues.push(title)
    }
    if (content !== undefined) {
        updateFields.push("content = ?")
        updateValues.push(content)
    }
    if (image !== undefined) {
        updateFields.push("image = ?")
        updateValues.push(image)
    }

    // se nessun campo è stato fornito da aggiornare restituiamo un errore
    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'Nessun campo da aggiornare' })
    }

    // creiamo la query sql per aggiornare il post
    const sqlUpdatePost = `
        Update posts 
        SET ${updateFields.join(",")}
        WHERE id = ?
    `
    updateValues.push(id)

    connection.query(sqlUpdatePost, updateValues, (err, result) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Post non trovato' });
        res.json({ message: "Post aggiornato con successo", id })
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
module.exports = { index, show, store, update, modify, destroy }