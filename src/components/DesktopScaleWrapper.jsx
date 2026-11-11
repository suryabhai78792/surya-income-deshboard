import React, { useEffect, useState } from 'react';

// यह कंपोनेंट सिर्फ डेस्कटॉप लेआउट को स्क्रीन के हिसाब से ऑटो-स्केल करेगा
const DesktopScaleWrapper = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1440; // डेस्कटॉप लेआउट की मूल चौड़ाई
      const currentWidth = window.innerWidth;

      if (currentWidth < baseWidth) {
        setScale(currentWidth / baseWidth);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50">
      <div
        className="origin-top-left transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${scale})`,
          width: scale < 1 ? '1440px' : '100%',
          height: scale < 1 ? `${100 / scale}%` : 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DesktopScaleWrapper;