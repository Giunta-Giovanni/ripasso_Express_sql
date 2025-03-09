// importiamo express
const express = require('express');
// importiamo router
const router = express.Router();
// importiamo i controllers
const controllers = require('../controllers/postsControllers')
const { index, show, store, update, modify, destroy } = controllers

// ROTTE CRUD
// index
router.get('/', index);
// show
router.get('/:id', show);
// store
router.post('/', store);
// update
router.put('/:id', update)
// modify
router.patch('/:id', modify)
// destroy
router.delete('/:id', destroy);

// ESPORTIAMO I MODULI DEI ROUTER
module.exports = router;

