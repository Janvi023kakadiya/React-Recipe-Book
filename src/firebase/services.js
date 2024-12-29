import { 
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { 
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from './config';

// Recipe Services
export const addRecipe = async (recipeData, imageFile, userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        let imageUrl = '';
        if (imageFile) {
            const storageRef = ref(storage, `recipes/${userId}/${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const docRef = await addDoc(collection(db, 'recipes'), {
            ...recipeData,
            imageUrl,
            userId,
            createdAt: new Date().toISOString()
        });

        return { id: docRef.id, ...recipeData, imageUrl };
    } catch (error) {
        console.error('Error adding recipe:', error);
        throw error;
    }
};

export const getRecipes = async (userId) => {
    try {
        const q = query(collection(db, 'recipes'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting recipes:', error);
        throw error;
    }
};

export const getRecipe = async (recipeId) => {
    try {
        const docRef = doc(db, 'recipes', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        throw new Error('Recipe not found');
    } catch (error) {
        console.error('Error getting recipe:', error);
        throw error;
    }
};

export const updateRecipe = async (recipeId, recipeData, imageFile, userId) => {
    try {
        const docRef = doc(db, 'recipes', recipeId);
        let updateData = { ...recipeData };

        if (imageFile) {
            // Delete old image if exists
            if (recipeData.imageUrl) {
                const oldImageRef = ref(storage, recipeData.imageUrl);
                try {
                    await deleteObject(oldImageRef);
                } catch (error) {
                    console.warn('Error deleting old image:', error);
                }
            }

            // Upload new image
            const storageRef = ref(storage, `recipes/${userId}/${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);
            updateData.imageUrl = imageUrl;
        }

        await updateDoc(docRef, updateData);
        return { id: recipeId, ...updateData };
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

export const deleteRecipe = async (recipeId, imageUrl) => {
    try {
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            try {
                await deleteObject(imageRef);
            } catch (error) {
                console.warn('Error deleting image:', error);
            }
        }
        await deleteDoc(doc(db, 'recipes', recipeId));
        return true;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};

// Image upload service
export const uploadImage = async (file, userId) => {
    try {
        if (!file || !userId) {
            throw new Error('File and user ID are required');
        }

        const storageRef = ref(storage, `recipes/${userId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Image URL validation
export const validateImageUrl = async (url) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error('URL is required'));
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Invalid image URL'));
        img.src = url;
    });
};

// Search recipes
export const searchRecipes = async (userId, searchTerm, category = 'all') => {
    try {
        let q = query(collection(db, 'recipes'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        let recipes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            recipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchLower) ||
                recipe.description.toLowerCase().includes(searchLower) ||
                recipe.ingredients.toLowerCase().includes(searchLower)
            );
        }

        // Filter by category
        if (category && category !== 'all') {
            recipes = recipes.filter(recipe => recipe.category === category);
        }

        return recipes;
    } catch (error) {
        console.error('Error searching recipes:', error);
        throw error;
    }
};

const services = {
    addRecipe,
    getRecipes,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    uploadImage,
    validateImageUrl,
    searchRecipes
};

export default services;
