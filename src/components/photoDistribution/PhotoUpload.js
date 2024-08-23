// src/pages/PhotoUpload.js
import React, { useState } from 'react';
import { uploadPhoto } from '../../services/Services';
import '../../components/photoDistribution/photoUpload.css';

const PhotoUpload = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setStatus('Please select files to upload.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });

    try {
      await uploadPhoto(formData);
      setStatus('Photos uploaded successfully!');
      setFiles([]);
    } catch (error) {
      setStatus('Error uploading photos.');
    }
  };

  return (
    <div className="photo-upload-container">
      <h2>Upload Photos</h2>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default PhotoUpload;
