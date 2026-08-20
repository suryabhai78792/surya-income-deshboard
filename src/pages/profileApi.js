// src/pages/profileApi.js
import { callApi } from '../api'; // मेन api.js को इम्पोर्ट करें

export async function fetchUserProfile() {
  try {
    const token = localStorage.getItem('token');
    const response = await callApi('/api/profile', 'GET', null, token);

    if (!response.ok) {
      throw new Error(response.message || 'Failed to fetch profile');
    }

    // सुरक्षित रूप से डेटा रिटर्न करें
    return response.data?.profile || null;

  } catch (err) {
    console.error("Profile Fetch Error:", err);
    throw err; // React Query को बताने के लिए कि एरर आ गई है
  }

}

