import React from 'react';
import { User } from 'lucide-react';

const ProfileDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* 1. पीछे का काला धुंधला पर्दा (Overlay) */}
      <div 
        className="fixed inset-0 bg-gray bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. बाएं से दाएं स्लाइड होकर आने वाला बॉक्स */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
        
        {/* ड्रावर का हेडर */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
          <h2 className="font-bold text-lg text-gray-800">यूजर प्रोफाइल</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 font-bold text-xl px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ड्रावर का बॉडी - यहाँ आप अपनी Profile API का डेटा दिखाएंगे */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">प्रोफाइल API डेटा यहाँ लोड होगा...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileDrawer;