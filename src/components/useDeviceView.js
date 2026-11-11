import { useState, useEffect } from 'react';

export function useDeviceView() {
  const [deviceView, setDeviceView] = useState(() => {
    // शुरुआती लोड पर स्क्रीन की चौड़ाई चेक करें
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  });

  useEffect(() => {
    const updateDeviceView = () => {
      const width = window.innerWidth;

      // अगर स्क्रीन की चौड़ाई 768px से कम है, तो मोबाइल पोर्ट्रेट व्यू दिखाएं
      // और अगर इससे ज्यादा है, तो सीधा डेस्कटॉप व्यू दिखाएं
      if (width < 768) {
        setDeviceView('mobile');
      } else {
        setDeviceView('desktop');
      }
    };

    updateDeviceView();
    window.addEventListener('resize', updateDeviceView);

    return () => {
      window.removeEventListener('resize', updateDeviceView);
    };
  }, []);

  return deviceView;
}