import React, { useState } from 'react';
import { uploadImage } from '../../firebase/services';

const ImageUpload = ({ userId, onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file, userId);
      onUploadSuccess(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      disabled={uploading}
    />
  );
};

export default ImageUpload;
