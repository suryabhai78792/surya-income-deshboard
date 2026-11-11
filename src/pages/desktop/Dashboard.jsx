import React, { useState } from 'react';
import StatsCard from '../../components/StatsCard';
import PieChartCard from '../../components/PieChartCard';
import ReusableTable from '../../components/ReusableTable';
import LiveChartBox from '../../components/LiveChartBox'; // 👈 यहाँ इम्पोर्ट करें
import { convertDataByMode } from '../../components/dataConverter';

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


const Dashboard = ({ data, viewMode }) => {
  const [pieData, setPieData] = useState(originalPieData);
  const [loanData, setLoanData] = useState(originalLoanData);
  const { tableData: convertedTableData } = convertDataByMode(data, viewMode, 'income');

  const [income, setIncome] = useState("2,84,345");
  const [expense, setExpense] = useState("40,234");
  const [budget, setbudget] = useState("60,000"); // <--- यह लाइन जोड़ें
  const [savings, setSavings] = useState("95,111");
  const [loan, setloan] = useState("1,40,111");

  
  return (
    <div className="p-4 space-y-6">
      <StatsCard income={income} expense={expense} budget={budget} savings={savings} loan={loan} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* 👈 यहाँ सीधे इस कॉम्पोनेंट को रख दें */}
          <LiveChartBox data={data} viewMode={viewMode} />
        </div>
        <PieChartCard
          title="लोन का वर्गीकरण"
          subtitle="(Category-wise Breakdown of Loans)"
          data={loanData}
          showPercentage={true}
          isDonut={true}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-300">
          <ReusableTable data={convertedTableData} />
        </div>
        <PieChartCard
          title="मंथली खर्च का वर्गीकरण"
          subtitle="(Monthly Expense Category-wise Breakdown)"
          data={pieData}
          showPercentage={false}
          isDonut={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;