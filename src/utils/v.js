import * as Yup from 'yup';

export const recipeValidationSchema = Yup.object({
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

export const authValidationSchema = {
  login: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  }),
  register: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  })
};
