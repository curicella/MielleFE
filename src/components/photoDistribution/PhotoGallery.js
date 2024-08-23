import React, { useState, useEffect } from "react";
import { getPhotos } from "../../services/Services";
import "../../components/photoDistribution/photoGallery.css";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photosData = await getPhotos();
        setPhotos(photosData);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div className="photo-gallery-container">
      <h2>Your Photos</h2>
      <div className="photo-grid">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.url} alt={photo.name} />
              <a href={photo.url} download>
                Download
              </a>
            </div>
          ))
        ) : (
          <p>No photos available.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
