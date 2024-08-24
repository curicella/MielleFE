import React, { useState, useEffect } from "react";
import {
  getPhotosByDate,
  getUserCredits,
  downloadPhoto,
  schedulePhotoPrinting,
} from "../../services/Services";
import "./photoGallery.css";

const PhotoGallery = () => {
  const [photosByDate, setPhotosByDate] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photos = await getPhotosByDate();
        setPhotosByDate(photos);
        const credits = await getUserCredits();
        setUserCredits(credits);
      } catch (error) {
        console.error("Error fetching photos or credits:", error);
      }
    };
    fetchData();
  }, []);

  const handleToggleExpand = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleDownloadPhoto = async (photoId) => {
    try {
      const result = await downloadPhoto(photoId, userCredits);
      setUserCredits(result.remainingCredits);
      window.location.href = result.downloadUrl;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSchedulePrinting = async (date) => {
    try {
      const photoIds = photosByDate[date].map((photo) => photo.id);
      await schedulePhotoPrinting(photoIds, 1); // Replace with actual user ID
      alert("Printing scheduled successfully.");
    } catch (error) {
      console.error("Error scheduling photo printing:", error);
    }
  };

  return (
    <div className="photo-gallery-container">
      <h2>Your Albums</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {Object.keys(photosByDate).length === 0 ? (
        <p>No albums available.</p>
      ) : (
        Object.keys(photosByDate).map((date) => (
          <div key={date} className="photo-gallery-date">
            <div className="date-header">
              <span>{date}</span>
              <button onClick={() => handleToggleExpand(date)}>
                {expandedDate === date ? "less <<" : "more >>"}
              </button>
              <button onClick={() => handleSchedulePrinting(date)}>
                Schedule Printing
              </button>
            </div>
            <div
              className={`photo-gallery-content ${
                expandedDate === date ? "expanded" : ""
              }`}
            >
              {photosByDate[date].map((photo) => (
                <div key={photo.id} className="photo-thumbnail">
                  <div className="photo-placeholder"></div>
                  <button onClick={() => handleDownloadPhoto(photo.id)}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PhotoGallery;
