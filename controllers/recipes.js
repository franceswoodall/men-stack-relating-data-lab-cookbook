const express = require('express');
const router = express.Router();

const User = require('../models/user.js'); 
const Recipe = require('../models/recipe.js'); 
const Ingredient = require('../models/ingredient.js'); 


// landing page
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
router.get('/new', async (req, res) => {
    try {
        const allIngredients = await Ingredient.find({});
    res.render('recipes/new.ejs', { ingredients: allIngredients });
    } catch (error) {
        res.redirect('/recipes'); 
    } 
}); 

// create recipe 
router.post('/', async (req, res) => {
    try {

        const newRecipe = new Recipe(req.body); 
        newRecipe.owner = req.session.user._id; 

        await newRecipe.save(); 
        res.redirect('/recipes'); 

    } catch (error) {
        console.log(error); 
        res.redirect('/');
    }
}); 

// edit recipe

router.get('/:recipeId/edit', async (req, res) => {
    try { 
        const editRecipe = await Recipe.findById(req.params.recipeId); 
        const allIngredients = await Ingredient.find({}); 

        if (!editRecipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes'); 
        }

        res.render('recipes/edit.ejs', {
            recipe: editRecipe, 
            ingredients: allIngredients
        }); 
    } catch (error) {
        console.log(error); 
        res.redirect('/'); 
    }
})

//show recipe 

router.get('/:recipeId', async (req, res) => {
    try {
    const retrievedRecipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    
    res.render('recipes/show.ejs', { recipe: retrievedRecipe }); 
    } catch (error) {
        console.log(error); 
        res.redirect('/recipes'); 
    } 
}); 

// delete recipe

router.delete('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId); 

        if (recipe.owner.equals(req.session.user._id)) {
            await recipe.deleteOne(); 
            res.redirect('/recipes');
        } else {
            res.redirect('/recipes'); 
        }
    } catch (error) {
        console.log(error);
        res.redirect('/'); 
    }
}); 

router.put('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId); 

        if (!recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes'); 
        }
  
        recipe.name = req.body.name; 
        recipe.instructions = req.body.instructions; 

        recipe.ingredients = req.body.ingredients || []; 

        await recipe.save();
        res.redirect(`/recipes/${req.params.recipeId}`); 


     } catch (error) {
        console.log(error); 
        res.redirect('recipes'); 
    }

       
}); 



module.exports = router; 
