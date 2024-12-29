import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import { Edit, Delete, AccessTime } from '@mui/icons-material';
import { useRecipes } from '../../hooks/useRecipes';
import Loading from '../common/Loading';
import { formatDate, formatTime } from '../../utils/helpers';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipe, deleteRecipe } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipe(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, getRecipe]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(recipe.id, recipe.imageUrl);
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!recipe) return <Typography>Recipe not found</Typography>;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {recipe.title}
          </Typography>
          <Box>
            <IconButton onClick={() => navigate(`/recipe/edit/${recipe.id}`)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        {recipe.imageUrl && (
          <Box sx={{ mb: 3 }}>
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1 }} />
              <Typography>
                Prep: {formatTime(recipe.prepTime)} | Cook: {formatTime(recipe.cookTime)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">
              Created: {formatDate(recipe.createdAt)}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body1" paragraph>
          {recipe.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Ingredients
        </Typography>
        <Typography paragraph>
          {recipe.ingredients}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <Typography paragraph>
          {recipe.instructions}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Back to Recipes
        </Button>
      </Paper>
    </Container>
  );
};

export default RecipeDetail;
