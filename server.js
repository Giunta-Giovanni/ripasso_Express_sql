// importiamo express :)
const express = require('express');
// inizializziamo express e lo salviamo in variabile
const app = express();
// salviamo la porta del serve che vogliamo utilizzare
const port = 3000;

// importiamo i router
const postRouters = require('./routes/postsRouter')

// Importiamo cors
const cors = require('cors');

// registro il body parsers
app.use(express.json());

// Abilitiamo Cors 
// non utilizzato 
app.use(cors());

// colleghiamo la cartella con i file statici
// non utilizzato 
app.use(express.static('public'));

// imporstiamo la prima rotta home
app.get('/', (req, res) => { res.json('via martiri della liberta n 8 pozzallo rg') })

// impostiamo le rotte per le operazioni crud
app.use('/posts', postRouters);

// avviamo il server mettendolo in ascolto nella porta indicata
app.listen(port, () => {
    console.log(`bella raga sono su port ${port}`)
})

