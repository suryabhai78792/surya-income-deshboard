import React, { useEffect, useState } from 'react';

const DesktopScaleWrapper = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1660; // आपके डेस्कटॉप लेआउट की मूल तय चौड़ाई
      const currentWidth = window.innerWidth;

      // अगर स्क्रीन डेस्कटॉप की चौड़ाई से कम है, तो आनुपातिक (proportional) जूम-आउट करें
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
          width: scale < 1 ? '1660px' : '100%',
          height: scale < 1 ? `${100 / scale}%` : 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DesktopScaleWrapper;