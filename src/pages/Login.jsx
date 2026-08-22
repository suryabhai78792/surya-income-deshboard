import { useState, useEffect } from 'react';
import { callApi } from '../api';
import Register from './Register'; // इम्पोर्ट करें

export default function FinanceLogin({ onLoginSuccess }) {
  // 1. प्रोडक्ट आईडी फिक्स्ड है
  const productId = "Finance_Tracker";

  const [userId, setUserId] = useState("surya@spreeti.com");
  const [password, setPassword] = useState("Surya%12345");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // पेज खुलते ही चेक करें कि क्या यूजर पहले से लॉग इन है
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // अगर टोकन है, तो आप इसे डैशबोर्ड पर भेज सकते हैं
      // window.location.href = "/dashboard"; 
      console.log("User is already logged in");
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🚀 callApi का उपयोग करके लॉगिन रिक्वेस्ट भेजें
      // चूंकि callApi खुद /api/client-admin जोड़ देता है, इसलिए यहाँ सिर्फ '/login' देंगे
      const res = await callApi('/api/login', 'POST', {
        user_id: userId,
        password: password,
        product_id: productId
      });

      if (res.ok && res.data) {
        const token = res.data.token;
        const role = res.data.role;

        // 1. लोकल स्टोरेज में सेव करें
        localStorage.setItem('token', token);
        localStorage.setItem('role', role || 'client_admin');

        // App.jsx को बताना कि लॉगिन सफल हो गया है
        if (onLoginSuccess) {
          onLoginSuccess(); // यह App.jsx वाले फंक्शन को ट्रिगर कर देता है
          window.location.reload();
        }

        // 4. यहाँ डैशबोर्ड पर रीडायरेक्ट कर दें
        // window.location.href = "/dashboard"; 
      } else {
        // ✅ यहाँ 'res.data' का उपयोग करें
        alert("लॉगिन फेल: " + (res.data?.message || "अमान्य विवरण"));
      }
    } catch (err) {
      alert("सर्वर से कनेक्ट करने में समस्या हुई!");
    } finally {
      setIsLoading(false);
    }
  }


  const [isRegistering, setIsRegistering] = useState(false); // 👈 यह ट्रैक करेगा कि कौन सा पेज दिखाना है

  // अगर यूजर रजिस्टर करना चाहता है, तो Register कंपोनेंट दिखाएं
  if (isRegistering) {
    return (
      <Register
        onSwitchToLogin={() => setIsRegistering(false)}
        onRegisterSuccess={() => setIsRegistering(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">Finance Tracker Login</h3>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="यूजर आईडी"
            className="w-full px-3 py-2 border rounded-md"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="पासवर्ड"
              className="w-full px-3 py-2 border rounded-md"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-sm">
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700"
          >
            {isLoading ? 'लॉगिन हो रहा है...' : 'Login'}
          </button>
        </form>
        {/* 👇 रजिस्टर पेज पर जाने के लिए बटन */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <button
            onClick={() => setIsRegistering(true)}
            className="mt-2 text-blue-600 font-semibold hover:underline"
          >
            Create New Account (Register)
          </button>
        </div>

      </div>
    </div>
  );
}

