const express = require('express');
const { v4: uuidv4 } = require('uuid');
const validateProduct = require('../middleware/validateProduct');
const { NotFoundError } = require('../utils/errors');

const router = express.Router();
let products = [];

// GET all with filter/pagination
router.get('/', (req, res) => {
  let { category, page = 1, limit = 10 } = req.query;
  let result = [...products];
  if (category) result = result.filter(p => p.category === category);
  const start = (page - 1) * limit;
  res.json(result.slice(start, start + +limit));
});

// GET by ID
router.get('/:id', (req, res, next) => {
  const found = products.find(p => p.id === req.params.id);
  if (!found) return next(new NotFoundError('Not found'));
  res.json(found);
});

// POST new
router.post('/', validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update
router.put('/:id', validateProduct, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Not found'));
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE
router.delete('/:id', (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Not found'));
  products.splice(index, 1);
  res.sendStatus(204);
});

// SEARCH
router.get('/search', (req, res) => {
  const { name } = req.query;
  const result = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(result);
});

// STATS
router.get('/stats', (req, res) => {
  const stats = {};
  products.forEach(p => stats[p.category] = (stats[p.category] || 0) + 1);
  res.json(stats);
});

module.exports = router;
