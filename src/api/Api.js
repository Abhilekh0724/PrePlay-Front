import axios from "axios";

// Base URL for your API
export const BASE_URL = "http://localhost:5000";

// Function to retrieve the authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create an Axios instance with default configurations
const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Allow cookies and credentials
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Authorization header with the token
Api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User APIs
export const registerUserApi = (data) => Api.post("/api/user/create", data);
export const loginUserApi = (data) => {
  console.log('Login request data:', data); // Debug log
  return Api.post("/api/user/login", data).then(response => {
    console.log('Login response:', response.data); // Debug log
    return response;
  });
};

// Profile APIs
export const uploadProfilePicApi = (formData) =>
  Api.post("/api/profile/uploadProfilePic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getUserProfileApi = (userId) => Api.get(`/api/profile/user/${userId}`);

// Admin APIs
export const createCategoryApi = (formData) =>
  Api.post("/api/admin/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getCategoriesApi = () => Api.get("/api/admin/get");
export const getCategoryByIdApi = (id) => Api.get(`/api/admin/get/${id}`);
export const updateCategoryApi = (id, formData) =>
  Api.put(`/api/admin/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteCategoryApi = (id) => Api.delete(`/api/admin/delete/${id}`);
export const searchCategoriesApi = (query) => Api.get(`/api/admin/search?q=${query}`);

// Review APIs
export const postReviewApi = (reviewData) => Api.post("/api/review", reviewData);
export const getReviewsByCategoryApi = (categoryId) =>
  Api.get(`/api/review/${categoryId}`);

// Booking APIs
export const createBookingApi = (bookingData) => Api.post("/api/book/book", bookingData);
export const getBookingsByCategoryApi = (categoryId) =>
  Api.get(`/api/book/category/${categoryId}`);
export const getBookingsByUserApi = () => Api.get("/api/book/bookeduser");
export const cancelBookingApi = (bookingId) => Api.patch(`/api/book/cancel/${bookingId}`);
export const deleteBookingApi = (bookingId) => Api.delete(`/api/book/delete/${bookingId}`);
export const getAllBookingsApi = () => Api.get("/api/book/all");

// Payment APIs
export const createPaymentApi = (paymentData) => Api.post("/api/payment/place", paymentData);
export const verifyEsewaPaymentApi = (queryParams) =>
  Api.get("/api/payment/esewa/success", { params: queryParams });

export default Api;
