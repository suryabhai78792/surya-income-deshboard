import React from 'react';
import { X, Clock, Settings, Database, LogOut, User } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const ProfileDrawer = ({ isOpen, onClose }) => {

    const queryClient = useQueryClient();

    // कैश से डेटा उठाएं (जो App.jsx ने लोड किया था)
    const userData = queryClient.getQueryData(['userProfile']);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex">
            {/* 1. पीछे का हल्का काला और धुंधला पर्दा (Overlay) */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            ></div>

            {/* 2. बाएं से दाएं स्लाइड होकर आने वाला बॉक्स */}
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl z-10 flex flex-col p-5 transform transition-transform duration-300 ease-out translate-x-0">

                {/* 👇 ड्रावर का हेडर: नाम, ईमेल और क्लोज बटन को एक ही लाइन में लाने के लिए */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-full bg-[#e0f7fa]">
                            <User size={24} color="#00d2ff" />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="m-0 text-base font-medium text-zinc-800 truncate">
                                {userData?.name || "यूजर"}
                            </h3>
                            <p className="m-0 text-xs text-zinc-500 truncate">
                                {userData?.email || "user@example.com"}
                            </p>
                        </div>
                    </div>

                    {/* क्लोज बटन अब बिल्कुल सीध में दाहिने कोने पर रहेगा */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 cursor-pointer border-none bg-transparent text-zinc-500 hover:text-zinc-800 p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                <hr className="my-4 h-px border-0 bg-zinc-100" />

                {/* प्रोफाइल के अंदर आने वाले मेनू (ऑप्शन लिस्ट) */}
                <div className="flex flex-col gap-1 flex-1">
                    <div
                        onClick={() => alert('History clicked')}
                        className="flex cursor-pointer items-center gap-4 rounded-lg p-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
                    >
                        <Clock size={18} color="#555" />
                        <span>History</span>
                    </div>

                    <div
                        onClick={() => alert('Download clicked')}
                        className="flex cursor-pointer items-center gap-4 rounded-lg p-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
                    >
                        <Database size={18} color="#555" />
                        <span>Download</span>
                    </div>

                    <div
                        onClick={() => alert('Settings clicked')}
                        className="flex cursor-pointer items-center gap-4 rounded-lg p-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
                    >
                        <Settings size={18} color="#555" />
                        <span>Settings</span>
                    </div>
                </div>

                <hr className="my-4 h-px border-0 bg-zinc-100" />

                {/* 👇 लॉग आउट का बटन - अब बाएं साइड (justify-start) आ गया है */}
                <div className="flex justify-start pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-md border-none bg-red-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-600 shadow-sm"
                    >
                        <LogOut size={16} />
                        <span>लॉग आउट</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfileDrawer;