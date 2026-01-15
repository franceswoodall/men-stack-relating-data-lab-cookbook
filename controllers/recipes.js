const express = require('express');
const router = express.Router();

const User = require('../models/user.js'); 
const Recipe = require('../models/recipe.js'); 
const Ingredient = require('../models/ingredient.js'); 

// landing page: GET /recipes 
router.get('/', async (req, res) => {
   try {
    const userRecipes = await Recipe.find({ owner: req.session.user._id })

    res.locals.recipes = userRecipes; 
    
    res.render('recipes/index.ejs'); 
   } catch (error) {
    res.redirect('/'); 
   }
}); 

// new recipe 
router.get('/new', (req, res) => {
    res.render('recipes/new.ejs'); 
}); 

// create recipe 
router.post('/', async (req, res) => {
    try {
        const ingredientName = req.body.ingredients; 
        let ingredientDoc = await Ingredient.findOne({ name: ingredientName}); 
        
        if (!ingredientDoc) {
            ingredientDoc = await Ingredient.create({ name: ingredientName }); 
        }

        const newRecipe = new Recipe({
            name: req.body.name, 
            instructions: req.body.instructions, 
            owner: req.session.user._id, 
            ingredients: [ingredientDoc._id]
        }); 

        await newRecipe.save(); 

        res.redirect('/recipes'); 
    } catch (error) {
        console.log('error creating recipe'); 
        console.log(error); 
        res.redirect('/');
    }
}); 

module.exports = router; 
