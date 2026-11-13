import React, { useState, useEffect } from 'react';
import './StatsCard.css';
import { TrendingUp } from 'lucide-react';

// ==========================================
// 1. रियूज़ेबल कार्ड कंपोनेंट
// ==========================================
const StatsCardItem = ({ 
  title,            
  subTitle,         
  badgeText,        // सबटाइटल के बाहर बिना ब्रैकेट का टेक्स्ट दिखाने के लिए
  value,            
  extraInfo,        
  percentage,       
  isPositive = true,
  bgColor = "bg-green-50",       
  borderColor = "border-green-700", 
  barColor = "bg-green-700",     
  gradientBorder = false,        
  children                       
}) => {
  
  if (gradientBorder) {
    return (
      <div className="p-[1px] rounded-xl bg-gradient-to-r from-gray-500 to-orange-400 h-full">
        <div className="h-full bg-gray-100 p-4 pb-0 rounded-[11px] flex flex-col justify-between">
          <div>
            <p className="font-bold text-gray-800">
              {title} <span className="font-normal text-gray-500">{subTitle}</span>
              {badgeText && <span className="text-gray-600 text-xs ml-1 font-normal">{badgeText}</span>}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              ₹{value}
              {extraInfo && <span className="text-gray-600 text-sm ml-1 whitespace-nowrap">{extraInfo}</span>}
            </h2>
            {children}
          </div>

          <div>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div className={`h-2 rounded-full ${barColor}`} style={{ width: '70%' }}></div>
            </div>
            <p className="flex items-center gap-1 mb-0 mt-1 whitespace-nowrap text-gray-700">
              पिछले महीने से 
              <span className={`font-normal ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                {percentage}
              </span>
              <TrendingUp size={14} className={`mr-1 ${isPositive ? 'text-green-700' : 'text-red-700'}`} />
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 pb-0 rounded-xl border ${bgColor} ${borderColor} flex flex-col justify-between h-full`}>
      <div>
        <p className="font-bold text-gray-800">
          {title} <span className="font-normal text-gray-500">{subTitle}</span>
          {badgeText && <span className="text-gray-600 text-xs ml-1 font-normal">{badgeText}</span>}
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          ₹{value}
          {extraInfo && <span className="text-gray-600 text-sm ml-1">{extraInfo}</span>}
        </h2>
        {children}
      </div>

      <div>
        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: '70%' }}></div>
        </div>
        <p className="flex items-center gap-1 mb-0 mt-1 whitespace-nowrap text-gray-700">
          पिछले महीने से 
          <span className={`font-normal ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            {percentage}
          </span>
          <TrendingUp size={14} className={`mr-1 ${isPositive ? 'text-green-700' : 'text-red-700'}`} />
        </p>
      </div>
    </div>
  );
};


// ==========================================
// 2. मुख्य डेस्कटॉप कंपोनेंट
// ==========================================
const StatsCardDesktop = ({ income, expense, budget, savings, loan }) => {

  const [currentMonthInterest, setCurrentMonthInterest] = useState(8623.47);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMonthInterest((prev) => prev + 0.025);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const principalAmount = loan; 
  const pastInterest = "60,000";     
  const maxMonthlyInterest = "12000"; 

  return (
    <div className="grid grid-cols-4 gap-4">
      
      {/* 1. कुल आय कार्ड */}
      <StatsCardItem
        title="कुल आय"
        subTitle="(Total Income)"
        value={income}
        extraInfo={`/₹${budget}(लक्ष्य)`}
        percentage="+5.2%"
        isPositive={true}
        bgColor="bg-green-50"
        borderColor="border-green-700"
        barColor="bg-green-700"
      />

      {/* 2. कुल खर्च कार्ड */}
      <StatsCardItem
        title="कुल खर्च"
        subTitle="(Total Expense)"
        value={expense}
        extraInfo={`/₹${budget}(बजट बैलेंस)`}
        percentage="+8.1%"
        isPositive={false}
        barColor="bg-orange-400"
        gradientBorder={true}
      />

      {/* 3. बचत कार्ड */}
      <StatsCardItem
        title="बचत"
        subTitle="(Savings)"
        value={savings}
        extraInfo={`/₹${income}(कमाई)`}
        percentage="+1%"
        isPositive={true}
        bgColor="bg-blue-50"
        borderColor="border-blue-700"
        barColor="bg-blue-700"
      />

      {/* 4. कुल कर्ज कार्ड */}
      <StatsCardItem
        title="कुल कर्ज"
        subTitle="(Total Loan)"
        badgeText="ब्याज-0.025/s"
        value={principalAmount}
        extraInfo={`/₹${pastInterest}+${currentMonthInterest.toFixed(2)}(${maxMonthlyInterest})`}
        percentage="+8.1%"
        isPositive={false}
        bgColor="bg-red-50"
        borderColor="border-red-700"
        barColor="bg-red-700"
      />

    </div>
  );
};

export default StatsCardDesktop;