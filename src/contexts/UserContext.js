// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getUserData, getUserBookings, updateUserProfile, getEmployeeTasks, uploadPhoto } from '../services/Services';

// Kreiramo UserContext
export const UserContext = createContext();

// UserProvider komponenta koja koristi UserContext
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);

        if (userData.role === 'employee') {
          const tasksData = await getEmployeeTasks();
          setTasks(tasksData);
        } else {
          const userBookings = await getUserBookings();
          setBookings(userBookings);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await updateUserProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handlePhotoUpload = async () => {
    try {
      await uploadPhoto(photo);
      setUploadStatus('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadStatus('Failed to upload photo.');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        bookings,
        tasks,
        photo,
        uploadStatus,
        updateProfile,
        handlePhotoChange,
        handlePhotoUpload,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using UserContext
export const useUser = () => React.useContext(UserContext);
