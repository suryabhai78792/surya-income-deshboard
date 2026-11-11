import React, { useState, useRef } from 'react';
import DateTime from '../../../components/DateTime';
import StatsCard from '../../../components/StatsCard';
import ProfileDrawer from '../../ProfileDrawer';
import PieChartCard from '../../../components/PieChartCard';
import ReusableTable from '../../../components/ReusableTable';
import { convertDataByMode } from '../../../components/dataConverter';
import { Bell, User } from 'lucide-react';

// --- डेटा और रंग ---
const originalPieData = [
  { name: 'Rent', value: 4000 },
  { name: 'Food', value: 3000 },
  { name: 'Travel', value: 2000 },
  { name: 'Fun', value: 1000 },
];

const originalLoanData = [
  { name: 'रामू', value: 9000, interest: '3%' },
  { name: 'बसबरीया', value: 18000, interest: '3%' },
  { name: 'श्याम', value: 37000, interest: '2%' },
  { name: 'मोहन', value: 48000, interest: '0%' },
];


const Home = ({ data, viewMode }) => {

  const [pieData, setPieData] = useState(originalPieData);
  const [loanData, setLoanData] = useState(originalLoanData);
  const { tableData: convertedTableData } = convertDataByMode(data, viewMode, 'income');

  const [income, setIncome] = useState("2,84,345");
  const [expense, setExpense] = useState("40,234");
  const [budget, setbudget] = useState("60,000"); // <--- यह लाइन जोड़ें
  const [savings, setSavings] = useState("95,111");
  const [loan, setloan] = useState("1,40,111");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      setActiveIndex(Math.round(scrollLeft / cardWidth));
    }
  };

  const handleScroll2 = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.offsetWidth;
    setActiveIndex2(Math.round(scrollLeft / cardWidth));
  };

  return (
    <div className="min-h-screen pt-15 pb-25 bg-white overflow-y-auto overscroll-y-none">
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white py-3 px-3 border-b border-gray-300 flex items-center justify-between">
        <div className="bg-gray-200 p-2 rounded-full cursor-pointer" onClick={() => setIsProfileOpen(true)}>
          <User className="text-gray-600" size={20} />
        </div>
        <DateTime />
        <div className="flex items-center gap-4">
          <Bell className="text-gray-500 cursor-pointer" size={24} />
        </div>
      </header>

      <StatsCard income={income} expense={expense} budget={budget} savings={savings} loan={loan} />

      {/* पाई चार्ट स्लाइडर */}
      <div className="flex flex-col gap-2">
        <div ref={scrollRef} onScroll={handleScroll} className="flex -space-x-[45%] -my-8 overflow-x-auto scrollbar-none px-4 py-2 w-full snap-x snap-mandatory">
          <div className="min-w-[123%] flex-shrink-0 snap-center snap-always origin-left transform scale-[0.8]">
            <PieChartCard title="मंथली खर्च का वर्गीकरण" subtitle="(Monthly Expense Category-wise Breakdown)" data={pieData} showPercentage={false} isDonut={false} />
          </div>
          <div className="min-w-[123%] flex-shrink-0 snap-center snap-always origin-right transform scale-[0.8]">
            <PieChartCard title="लोन का वर्गीकरण" subtitle="(Category-wise Breakdown of Loans)" data={loanData} showPercentage={true} isDonut={true} />
          </div>
        </div>
        <div className="flex justify-center mb-2 gap-2 md:hidden lg:hidden">
          {[0, 1].map((index) => (
            <div key={index} className={`h-1 w-1 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>

      {/* टेबल स्लाइडर */}
      <div className="flex flex-col gap-2">
        <div ref={scrollRef2} onScroll={handleScroll2} className="flex -space-x-[45%] -my-8 overflow-x-auto scrollbar-none px-4 py-2 w-full snap-x snap-mandatory">
          <div className="min-w-[123%] flex-shrink-0 snap-center snap-always origin-left transform scale-[0.8]">
            <ReusableTable data={convertedTableData} />
          </div>
          <div className="min-w-[123%] flex-shrink-0 snap-center snap-always origin-right transform scale-[0.8]">
            <ReusableTable data={convertedTableData} />
          </div>
        </div>
        <div className="flex justify-center mb-2 gap-2 md:hidden lg:hidden">
          {[0, 1].map((index) => (
            <div key={index} className={`h-1 w-1 rounded-full transition-all duration-300 ${activeIndex2 === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;