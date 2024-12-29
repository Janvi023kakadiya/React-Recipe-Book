import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import { RecipeProvider } from './Contexts/RecipeContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import RecipeList from './components/recipes/RecipeList';
import RecipeDetail from './components/recipes/RecipeDetail';
import RecipeForm from './components/recipes/RecipeForm';

function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <RecipeList />
              </PrivateRoute>
            } />
            <Route path="/recipe/:id" element={
              <PrivateRoute>
                <RecipeDetail />
              </PrivateRoute>
            } />
            <Route path="/recipe/new" element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            } />
            <Route path="/recipe/edit/:id" element={
              <PrivateRoute>
                <RecipeForm />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </RecipeProvider>
    </AuthProvider>
  );
}

export default App;
