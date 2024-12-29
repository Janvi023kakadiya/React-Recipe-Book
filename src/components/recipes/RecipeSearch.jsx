import React, { useState } from 'react';
import {
  TextField,
  Box,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search } from '@mui/icons-material';

const RecipeSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch({ searchTerm: value, category });
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory(value);
    onSearch({ searchTerm, category: value });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="main">Main Course</MenuItem>
          <MenuItem value="appetizer">Appetizer</MenuItem>
          <MenuItem value="dessert">Dessert</MenuItem>
          <MenuItem value="beverage">Beverage</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default RecipeSearch;
