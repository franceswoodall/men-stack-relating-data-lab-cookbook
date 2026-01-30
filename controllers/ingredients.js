const express = require('express');
const router = express.Router();

const User = require('../models/user.js'); 
const Recipe = require('../models/recipe.js'); 
const Ingredient = require('../models/ingredient.js'); 

router.get('/', async (req, res) => {
    try {
        const allIngredients = await Ingredient.find({}); 
        res.render('ingredients/index.ejs', { ingredients: allIngredients }); 
    } catch (error) {
        console.log(error); 
        res.redirect('/'); 
    }
}); 

router.post('/', async (req, res)=> {
    try {

        const ingredientName = req.body.name.toLowerCase(); 
        const existingIngredient = await Ingredient.findOne({ name: ingredientName }); 

        if (!existingIngredient) {
        await Ingredient.create({ name: ingredientName });
        }
        
        res.redirect('/ingredients'); 
    } catch (error) {
        console.log(error);
        res.redirect('/ingredients'); 
    }
}); 

module.exports = router;