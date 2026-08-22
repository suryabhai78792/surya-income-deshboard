// src/logout.js
export const handleAppLogout = (socketRef, setIsAuth) => {
  // 1. सॉकेट को तुरंत डिस्कनेक्ट करें
  if (socketRef && socketRef.current) {
    socketRef.current.disconnect();
  }

  // 2. लोकल स्टोरेज साफ़ करें
  localStorage.clear();

  // 3. स्टेट को फॉल्स करें
  setIsAuth(false);
  window.location.reload();
};