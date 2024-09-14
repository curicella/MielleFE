import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./photoGallery.css";
import { UserContext } from "../../contexts/UserContext";
import { saveAs } from 'file-saver';

const PhotoGallery = () => {
  const { user, token } = useContext(UserContext);
  const [credits, setCredits] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [album, setAlbum] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showDesignModal, setShowDesignModal] = useState(false); // Novo stanje za modal dizajna
  const [selectedDesign, setSelectedDesign] = useState(null); // Novo stanje za odabrani dizajn
 


  const availableDesigns = [
    { id: 1, name: "Elegant", imageUrl: "/dizajn1.jpeg" },
    { id: 2, name: "Modern", imageUrl: "/dizajn2.jpeg" },
    { id: 3, name: "Classic", imageUrl: "/dizajn3.jpeg" },
    { id: 4, name: "Vintage", imageUrl: "/dizajn4.jpeg" }
  ];
  

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user, token]);

  const fetchCredits = async () => {
    try {
      const response = await axios.get("http://naprednebaze.somee.com/api/Users/MyCredits", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCredits(response.data.credits || 0);
    } catch (error) {
      console.error("Error fetching credits", error);
    }
  };

  const handleDownloadPhoto = async (photo) => {
    if (credits < photo.cost) {
      setErrorMessage(`You need at least ${photo.cost} credits to download this photo.`);
      return;
    }

    try {
      const response = await axios.post(
        "http://naprednebaze.somee.com/api/Albums/downloadPhoto",
        {
          userId: user.id,
          photoId: photo.id
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const fileName = photo.fileName || 'download';
        saveAs(blob, fileName);

        setSuccessMessage("Photo downloaded successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to download photo.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error downloading photo", error);
      setErrorMessage("Failed to download photo. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleFetchAlbum = async () => {
    try {
      const response = await axios.get(`http://naprednebaze.somee.com/api/Albums/${accessCode}/photos`);
      const albumData = response.data;
      if (albumData && albumData.album && albumData.photos && Array.isArray(albumData.photos.$values)) {
        const album = albumData.album;
        const photos = albumData.photos.$values;
        setPhotos(photos);
        setAlbum(album);
      } else {
        setErrorMessage("Unexpected album data format.");
      }
    } catch (error) {
      console.error("Error fetching album with photos", error);
      setErrorMessage("Failed to fetch album. Please try again.");
    }
  };

  const handleClickPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleToggleSelectPhoto = (photo) => {
    setSelectedPhotos((prevSelectedPhotos) =>
      prevSelectedPhotos.includes(photo)
        ? prevSelectedPhotos.filter((p) => p !== photo)
        : [...prevSelectedPhotos, photo]
    );
  };

  const handleOpenDesignModal = () => {
    setShowDesignModal(true);
  };

  const handleSelectDesign = (design) => {
    setSelectedDesign(design.id); // Postavi ID odabranog dizajna
  };
  

  const handleConfirmSelection = () => {
    setSuccessMessage("Please come to the studio in 15 days to collect your album.");
    setSelectedPhotos([]);
    setSelectedDesign(null); // Očistiti izbor dizajna
  };

  return (
    <div className="photo-gallery-container">
      <h2>Your Albums</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="access-code-form">
        <input
          type="text"
          placeholder="Enter album access code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
        <button onClick={handleFetchAlbum}>Fetch Album</button>
      </div>
      {album ? (
        photos.length === 0 ? (
          <p>No photos available in this album.</p>
        ) : (
          <div className="photo-gallery-content">
            {photos.map((photo, index) => (
              <div key={photo.Id || index} className="photo-thumbnail">
                <img
                  src={photo.filePath}
                  alt="Photo"
                  className={`photo-image ${selectedPhotos.includes(photo) ? 'selected' : ''}`}
                  onClick={() => handleClickPhoto(photo)}
                />
                <button 
                  className="select-button" 
                  onClick={() => handleToggleSelectPhoto(photo)}
                >
                  {selectedPhotos.includes(photo) ? '✔' : '✗'}
                </button>
                <button 
                  className="download-button" 
                  onClick={() => handleDownloadPhoto(photo)}
                >
                  Download
                </button>
              </div>
            ))}
            {!successMessage && (
              <div>
                <button className="confirm-selection-button" onClick={handleOpenDesignModal}>
                  Choose Cover Design
                </button>
                <button className="confirm-selection-button" onClick={handleConfirmSelection}>
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <p>Please enter an access code to view the album.</p>
      )}

      {selectedPhoto && (
        <div className="lightbox" onClick={handleCloseLightbox}>
          <button className="lightbox-close" onClick={handleCloseLightbox}>
            &times;
          </button>
          <img src={selectedPhoto.filePath} alt="Selected Photo" />
        </div>
      )}

      {/* Modal za dizajne */}
      {showDesignModal && (
  <div className="design-modal">
    <div className="design-modal-content">
      <h3>Select a Cover Design</h3>
      <div className="design-options">
        {availableDesigns.map((design) => (
          <div
            key={design.id}
            className={`design-option ${selectedDesign === design.id ? 'selected' : ''}`} // Dodaj klasu ako je dizajn odabran
            onClick={() => handleSelectDesign(design)}
          >
            <img src={design.imageUrl} alt={design.name} className="design-image" />
            <p>{design.name}</p>
            {selectedDesign === design.id && (
              <span className="checkmark">✔️</span> // Prikaz "tacno" ikone
            )}
          </div>
        ))}
      </div>
      <button className="close-modal-button" onClick={() => setShowDesignModal(false)}>
        Close
      </button>
    </div>
  </div>
)}



    </div>
  );
};

export default PhotoGallery;
