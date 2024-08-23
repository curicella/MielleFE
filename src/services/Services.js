import axios from "axios";

const API_URL = "https://your-api-url.com"; // change to your actual API URL

export const loginUser = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Mock function to check availability
export const checkAvailability = async (formData) => {
  return {
    available: true,
    price: 100,
  };
};

// Mock function to create a payment intent
export const createPaymentIntent = async (price) => {
  return {
    clientSecret: "test-client-secret",
  };
};

// Funkcija za dobijanje podataka o korisniku
export const getUserData = async () => {
  return axios.get(`${API_URL}/user`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user data:', error);
      throw error;
    });
};

// Funkcija za dobijanje rezervacija korisnika
export const getUserBookings = async () => {
  return axios.get(`${API_URL}/user/bookings`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user bookings:', error);
      throw error;
    });
};

// Funkcija za ažuriranje profila korisnika
export const updateUserProfile = async (userData) => {
  return axios.put(`${API_URL}/user`, userData)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating user profile:', error);
      throw error;
    });
};

export const getEmployeeData = async (employeeId) => {
  return {
    id: employeeId,
    firstName: "Jane",
    lastName: "Smith",
    email: "janesmith@example.com",
  };
};

export const getEmployeeSessions = async () => {
  return [
    {
      id: 1,
      type: 'Wedding',
      date: '2024-09-15',
      location: 'Central Park',
      status: 'Confirmed',
    },
    {
      id: 2,
      type: 'Graduation',
      date: '2024-10-22',
      location: 'Harvard University',
      status: 'Pending',
    },
  ];
};

// Mock function to get all employees
export const getAllEmployees = async () => {
  return [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      role: 'Photographer',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Editor',
    },
  ];
};

// Mock function to get statistics
export const getStatistics = async () => {
  return {
    totalSessions: 20,
    totalRevenue: 5000,
  };
};

// Funkcija za upload fotografija
export const uploadPhoto = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading photos:', error);
    throw error;
  }
};

// Funkcija za preuzimanje fotografija
export const getPhotos = async () => {
  try {
    // Ovdje bi trebala biti pravi URL za API preuzimanje
    const response = await axios.get(`${API_URL}/photos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};
export const getEmployeeTasks = async () => {
  return [
    { id: 1, description: "Upload photos from wedding", status: "Pending" },
    { id: 2, description: "Update graduation album", status: "Completed" }
  ];
};
