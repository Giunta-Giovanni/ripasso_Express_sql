// importiamo express
const express = require('express');
// importiamo router
const router = express.Router();
// importiamo i controllers
const controllers = require('../controllers/postsControllers')
const { index, destroy } = controllers

// ROTTE CRUD
router.get('/', index);
router.get('/:id', (req, res) => { res.json('questa è la rotta show cazzo') });
router.post('/', (req, res) => { res.json('questa è la rotta store zonna') });
router.put('/:id', (req, res) => { res.json('questa è la rotta update strunz') })
router.patch('/:id', (req, res) => { res.json('questa è la rotta modify cugghiuni') })
router.delete('/:id', destroy);

// ESPORTIAMO I MODULI DEI ROUTER
module.exports = router;

