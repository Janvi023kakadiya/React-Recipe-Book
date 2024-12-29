import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab
} from '@mui/material';
import { PhotoCamera, Link } from '@mui/icons-material';
import { useRecipes } from '../../hooks/useRecipes';
import { useAuth } from '../../hooks/useAuth';
import { uploadImage } from '../../firebase/services';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  ingredients: Yup.string()
    .required('Ingredients are required'),
  instructions: Yup.string()
    .required('Instructions are required'),
  prepTime: Yup.number()
    .required('Preparation time is required')
    .positive('Must be a positive number'),
  cookTime: Yup.number()
    .required('Cooking time is required')
    .positive('Must be a positive number'),
  category: Yup.string()
    .required('Category is required')
});

const RecipeForm = ({ recipe }) => {
  const navigate = useNavigate();
  const { addRecipe, updateRecipe } = useRecipes();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(recipe?.imageUrl || '');
  const [error, setError] = useState(null);
  const [imageInputType, setImageInputType] = useState('upload');

  const formik = useFormik({
    initialValues: {
      title: recipe?.title || '',
      description: recipe?.description || '',
      ingredients: recipe?.ingredients || '',
      instructions: recipe?.instructions || '',
      prepTime: recipe?.prepTime || '',
      cookTime: recipe?.cookTime || '',
      category: recipe?.category || 'main',
      imageUrl: recipe?.imageUrl || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!user) {
          setError('You must be logged in to create a recipe');
          return;
        }

        let finalImageUrl = values.imageUrl;

        if (imageInputType === 'upload' && imageFile) {
          const uploadedUrl = await handleImageUpload(imageFile);
          if (!uploadedUrl) return;
          finalImageUrl = uploadedUrl;
        }

        const recipeData = {
          ...values,
          imageUrl: finalImageUrl,
        };

        if (recipe) {
          await updateRecipe(recipe.id, recipeData, user.uid);
        } else {
          await addRecipe(recipeData, user.uid);
        }
        navigate('/');
      } catch (err) {
        setError('Failed to save recipe. Please try again.');
        console.error('Error saving recipe:', err);
      }
    },
  });

  const handleImageUpload = async (file) => {
    try {
      setError(null);
      const imageUrl = await uploadImage(file, user.uid);
      return imageUrl;
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Image upload error:', err);
      return null;
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      formik.setFieldValue('imageUrl', '');
    }
  };

  const handleUrlChange = (event) => {
    const url = event.target.value;
    formik.setFieldValue('imageUrl', url);
    setImagePreview(url);
    setImageFile(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {recipe ? 'Edit Recipe' : 'Create New Recipe'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Recipe Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              id="ingredients"
              name="ingredients"
              label="Ingredients"
              value={formik.values.ingredients}
              onChange={formik.handleChange}
              error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
              helperText={formik.touched.ingredients && formik.errors.ingredients}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              id="instructions"
              name="instructions"
              label="Instructions"
              value={formik.values.instructions}
              onChange={formik.handleChange}
              error={formik.touched.instructions && Boolean(formik.errors.instructions)}
              helperText={formik.touched.instructions && formik.errors.instructions}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              id="prepTime"
              name="prepTime"
              label="Prep Time (minutes)"
              type="number"
              value={formik.values.prepTime}
              onChange={formik.handleChange}
              error={formik.touched.prepTime && Boolean(formik.errors.prepTime)}
              helperText={formik.touched.prepTime && formik.errors.prepTime}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              id="cookTime"
              name="cookTime"
              label="Cook Time (minutes)"
              type="number"
              value={formik.values.cookTime}
              onChange={formik.handleChange}
              error={formik.touched.cookTime && Boolean(formik.errors.cookTime)}
              helperText={formik.touched.cookTime && formik.errors.cookTime}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                label="Category"
                onChange={formik.handleChange}
              >
                <MenuItem value="main">Main Course</MenuItem>
                <MenuItem value="appetizer">Appetizer</MenuItem>
                <MenuItem value="dessert">Dessert</MenuItem>
                <MenuItem value="beverage">Beverage</MenuItem>
                <MenuItem value="soup">Soup</MenuItem>
                <MenuItem value="salad">Salad</MenuItem>
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="snack">Snack</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Tabs
              value={imageInputType}
              onChange={(e, newValue) => setImageInputType(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab value="upload" label="Upload Image" icon={<PhotoCamera />} />
              <Tab value="url" label="Image URL" icon={<Link />} />
            </Tabs>

            {imageInputType === 'upload' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            ) : (
              <TextField
                fullWidth
                name="imageUrl"
                label="Image URL"
                value={formik.values.imageUrl}
                onChange={handleUrlChange}
                error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              />
            )}

            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Recipe preview"
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                  onError={(e) => {
                    e.target.src = '/default-recipe-image.jpg';
                    setError('Failed to load image. Please check the URL.');
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {recipe ? 'Update Recipe' : 'Create Recipe'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RecipeForm;
