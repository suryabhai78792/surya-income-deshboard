import React from 'react';
import { X, Clock, Settings, Database, LogOut, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileModal({ isOpen, onClose }) {

  const queryClient = useQueryClient();

  // कैश से डेटा उठाएं (जो App.jsx ने लोड किया था)
  const userData = queryClient.getQueryData(['userProfile']);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-[320px] rounded-2xl bg-white p-5 shadow-2xl border border-gray-200">
      <div
        className="fixed inset-0 bg-gray bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* पॉपअप का हेडिंग और क्लोज बटन */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#e0f7fa]">
            <User size={24} color="#00d2ff" />
          </div>
          <div>
            <h3 className="m-0 text-base font-medium text-zinc-800">
              {userData?.name || "यूजर"}
            </h3>
            <p className="m-0 text-xs text-zinc-500">
              {userData?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer border-none bg-transparent text-zinc-500 hover:text-zinc-800"
        >
          <X size={20} />
        </button>
      </div>

      <hr className="my-4 h-px border-0 bg-zinc-100" />

      {/* प्रोफाइल के अंदर आने वाले मेनू (सेटिंग्स और बैकअप) */}

      {/*----------------------------------------------------------------------------------------------------------------*/}
      <div className="flex flex-col gap-0">
        <div
          onClick={() => alert('History clicked')}
          className="flex cursor-pointer items-center gap-5 rounded-lg p-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
        >
          <Clock size={18} color="#555" />
          <span>History</span>
        </div>
        {/*----------------------------------------------------------------------------------------------------------------*/}
        <div
          onClick={() => alert('Backup clicked')}
          className="flex cursor-pointer items-center gap-5 rounded-lg p-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
        >
          <Database size={18} color="#555" />
          <span>Download</span>
        </div>
        {/*----------------------------------------------------------------------------------------------------------------*/}
        <div
          onClick={() => alert('Settings clicked')}
          className="flex cursor-pointer items-center gap-5 rounded-lg p-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
        >
          <Settings size={18} color="#555" />
          <span>Settings</span>
        </div>
        {/*----------------------------------------------------------------------------------------------------------------*/}

      </div>

      <hr className="my-4 h-px border-0 bg-zinc-100" />

      {/* लॉग आउट का बटन */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            localStorage.clear(); // 👈 टोकन और सारा डेटा साफ़ कर देगा
            window.location.reload(); // 👈 पेज को रिफ्रेश करके लॉगिन स्क्रीन पर ले जाएगा
          }}
          className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-red-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-600"
        >
          <LogOut size={16} />
          <span>लॉग आउट</span>
        </button>
      </div>


    </div>
  );
}