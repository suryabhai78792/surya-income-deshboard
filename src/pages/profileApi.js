// src/pages/profileApi.js
import { callApi } from '../api'; // मेन api.js को इम्पोर्ट करें

export async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  const response = await callApi('/api/profile', 'GET', null, token);
  
  if (!response.ok) throw new Error('Failed to fetch profile');
  
  // यहाँ से सीधा प्रोफाइल डेटा रिटर्न करें
  return response.data.profile;
}
