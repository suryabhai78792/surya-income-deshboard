import { LayoutDashboard, PlusCircle, Menu } from 'lucide-react';

const BottomNav = ({ onMenuClick }) => (
  <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around items-center h-16 z-40">
    <button className="flex flex-col items-center text-blue-600">
      <LayoutDashboard size={24} />
      <span className="text-[10px]">डैशबोर्ड</span>
    </button>

    {/* ट्रांजैक्शन बटन - स्क्रीन के ऊपर उठा हुआ */}
    <button className="bg-blue-600 text-white p-4 rounded-full -mt-8 shadow-xl border-4 border-gray-50">
      <PlusCircle size={32} />
    </button>

    <button onClick={onMenuClick} className="flex flex-col items-center">
      <Menu size={24} />
      <span className="text-[10px]">मेनू</span>
    </button>
  </nav>
);
export default BottomNav;