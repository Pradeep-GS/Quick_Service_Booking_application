import axios from "axios";

// ---------------- Base URL ----------------
export const BASE_URL = "http://localhost:8080";


export function setServiceProvider(obj) {
  localStorage.setItem("serviceProvider", JSON.stringify(obj));
}

export function getServiceProvider() {
  try {
    const raw = localStorage.getItem("serviceProvider");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function removeServiceProvider() {
  localStorage.removeItem("serviceProvider");
}

export function setServiceProviderId(id) {
  localStorage.setItem("serviceProviderId", id);
}

export function getServiceProviderId() {
  return localStorage.getItem("serviceProviderId");
}


// USER STORAGE (NORMAL USER)
export function setAppUser(obj) {
  localStorage.setItem("appUser", JSON.stringify(obj));
}

export function getAppUser() {
  try {
    const raw = localStorage.getItem("appUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function removeAppUser() {
  localStorage.removeItem("appUser");
}

export function setAppUserId(id) {
  localStorage.setItem("appUserId", id);
}

export function getAppUserId() {
  return localStorage.getItem("appUserId");
}



// ---------------- Axios Instance ----------------
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


// ---------------- Service Provider APIs ----------------

// Check if a service user already exists
export const checkServiceUser = async (email, mobileNumber) => {
  try {
    const res = await api.post("/service/check", { email, mobileNumber });
    return res.data;
  } catch (err) {
    console.error("Error checking service user:", err);
    throw err;
  }
};

// Register new service user
export const registerServiceUser = async (payload) => {
  try {
    const res = await api.post("/service/register", payload);
    return res.data;
  } catch (err) {
    console.error("Error registering service user:", err);
    throw err;
  }
};


export const loginServiceUser = async (email, password) => {
  try {
    const res = await api.post("/service/login", { email, password });

    if (res.data && res.data.success && res.data.provider) {
      setServiceProviderId(res.data.provider.id);
      setServiceProvider(res.data.provider);
    }

    return res.data;
  } catch (err) {
    console.error("Service login failed:", err);
    throw err;
  }
};

// Get service provider profile
export const getServiceProviderProfile = async (id) => {
  try {
    const res = await api.get(`/service/provider/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching provider profile:", err);
    throw err;
  }
};

// Update service provider profile
export const updateServiceProviderProfile = async (id, payload) => {
  try {
    const res = await api.put(`/service/update/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating provider profile:", err);
    throw err;
  }
};

// Get provider bookings
export const getProviderBookings = async (providerId) => {
  try {
    const res = await api.get(`/booking/provider/${providerId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching provider bookings:", err);
    throw err;
  }
};

// Get booking by ID
export const getBookingDetails = async (bookingId) => {
  try {
    const res = await api.get(`/booking/${bookingId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching booking details:", err);
    throw err;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const res = await api.put(`/booking/provider/action/${bookingId}?action=${status}`);
    return res.data;
  } catch (err) {
    console.error("Error updating booking status:", err);
    throw err;
  }
};

// Get all bookings for a user
export const getUserBookings = async (userId) => {
  try {
    const res = await api.get(`/booking/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    throw err;
  }
};

// Get all service categories
export const getServiceCategories = async () => {
  try {
    const res = await api.get("/service/getcat");
    return res.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

// Alias for backward compatibility
export { getServiceCategories as getCategories };

// Get provider notifications
export const getServiceNotifications = async (providerId) => {
  try {
    const res = await api.get(`/notification/service/${providerId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    throw err;
  }
};


// ---------------- Normal User APIs ----------------

// Get service user (normal user) by ID
export const getServiceUserById = async (userId) => {
  try {
    const res = await api.get(`/service/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching service user:", err);
    throw err;
  }
};

// Update normal user profile
export const updateServiceUserProfile = async (userId, payload) => {
  try {
    const res = await api.put(`/service/user/update/${userId}`, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating service user profile:", err);
    throw err;
  }
};
