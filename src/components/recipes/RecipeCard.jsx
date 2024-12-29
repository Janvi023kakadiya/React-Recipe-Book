import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import { Edit, Delete, AccessTime } from '@mui/icons-material';
import { useRecipes } from '../../hooks/useRecipes';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { deleteRecipe } = useRecipes();

  const handleEdit = () => {
    navigate(`/recipe/edit/${recipe.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(recipe.id, recipe.imageUrl);
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.imageUrl || '/default-recipe.jpg'}
        alt={recipe.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {recipe.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <AccessTime sx={{ mr: 1 }} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {recipe.prepTime + recipe.cookTime} mins
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size="small"
          color="primary"
          onClick={handleClick}
        >
          View Details
        </Button>
        <Box>
          <IconButton size="small" onClick={handleEdit}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={handleDelete} color="error">
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCard;
