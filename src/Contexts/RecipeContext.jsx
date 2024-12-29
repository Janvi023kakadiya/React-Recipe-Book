import React, { createContext, useState, useCallback } from 'react';
import * as recipeService from '../firebase/services';
import { useAuth } from '../hooks/useAuth';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Add this line to get the current user

  const fetchRecipes = useCallback(async () => {
    if (!user) return; // Add this check
    setLoading(true);
    try {
      const data = await recipeService.getRecipes(user.uid);
      setRecipes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addRecipe = async (recipeData, imageFile) => {
    if (!user) throw new Error('User must be logged in');
    setLoading(true);
    try {
      const newRecipe = await recipeService.addRecipe(recipeData, imageFile, user.uid);
      setRecipes(prev => [...prev, newRecipe]);
      setError(null);
      return newRecipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (recipeId, recipeData, imageFile) => {
    if (!user) throw new Error('User must be logged in');
    setLoading(true);
    try {
      const updatedRecipe = await recipeService.updateRecipe(recipeId, recipeData, imageFile, user.uid);
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId ? updatedRecipe : recipe
      ));
      setError(null);
      return updatedRecipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId, imageUrl) => {
    if (!user) throw new Error('User must be logged in');
    setLoading(true);
    try {
      await recipeService.deleteRecipe(recipeId, imageUrl);
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    recipes,
    loading,
    error,
    fetchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};
