import axios from "axios";

const API_URL = "https://your-api-url.com"; // change to your actual API URL

export const loginUser = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// export const checkAvailability = (formData) => {
//   return axios
//     .post(`${API_URL}/check-availability`, formData)
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error("There was an error checking availability:", error);
//       throw error;
//     });
// };

// export const createPaymentIntent = (amount) => {
//   return axios
//     .post(`${API_URL}/create-payment-intent`, { amount })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error("There was an error creating payment intent:", error);
//       throw error;
//     });
// };

export const checkAvailability = async (formData) => {
  return {
    available: true,
    price: 100,
  };
};

export const createPaymentIntent = async (price) => {
  return {
    clientSecret: "test-client-secret",
  };
};

