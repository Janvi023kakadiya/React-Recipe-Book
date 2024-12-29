import React, { useEffect } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../../hooks/useRecipes';
import { useAuth } from '../../hooks/useAuth';
import RecipeCard from './RecipeCard';
import Loading from '../common/Loading';
import RecipeSearch from './RecipeSearch';

const RecipeList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipes, loading, error, fetchRecipes } = useRecipes();

  useEffect(() => {
    if (user) {
      fetchRecipes(user.uid);
    }
  }, [user, fetchRecipes]);

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Recipes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/recipe/new')}
        >
          Add Recipe
        </Button>
      </Box>

      <RecipeSearch />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {recipes.map((recipe) => (
          <Grid item key={recipe.id} xs={12} sm={6} md={4}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
        {recipes.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              No recipes found. Add your first recipe!
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RecipeList;
