const express = require('express');
const router = express.Router();

const User = require('../models/user.js'); 
const Recipe = require('../models/recipe.js'); 

// routes

// landing page: GET /recipes 
router.get('/', (req, res) => {
    res.render('recipes/index.ejs'); 
}); 

// new recipe page: GET /recipes/new
router.get('/new', (req, res) => {
    res.render('recipes/new.ejs'); 
}); 
module.exports = router; 
