import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ income, expense, savings, budget }) => {
  return (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-xl border border-green-700">
            <p className="font-bold">कुल आय <span className="font-normal text-gray-500">(Total Income)</span></p>
            <h2 className="text-2xl font-bold">₹{income}</h2>            
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-green-700">+5.2%</span><TrendingUp size={14} className="mr-1 text-green-700" /></p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-700">
            <p className="font-bold">कुल खर्च <span className="font-normal text-gray-500">(Total Expense)</span></p>
            <h2 className="text-2xl font-bold">₹{expense}</h2>
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-red-700"> +8.1% </span> <TrendingUp size={14} className="mr-1 text-red-700" /></p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-700">
            <p className="font-bold">बचत <span className="font-normal text-gray-500">(Savings)</span></p>
            <h2 className="text-2xl font-bold">₹{savings}</h2>
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap text-blue-500">बजट से अधिक</p>
          </div>
                {/* बाहरी कंटेनर को एक निश्चित ऊँचाई (h-full) दें */}
                <div className="h-full p-[1px] rounded-xl bg-gradient-to-r from-gray-500 to-orange-400">                  
                  {/* अंदर वाले कार्ड को भी h-full और flex-col दें ताकि वो ऊपर से नीचे पूरा भरे */}
                  <div className="h-full bg-gray-100 p-4 rounded-[11px] flex flex-col justify-between">
                    <div>
                      <p className="font-bold">बजट बैलेंस <span className="font-normal text-gray-500">(Budget Balance)</span></p>
                      <h2 className="text-2xl font-bold">
                        ₹{budget} <span className="text-orange-600">remaining</span>
                      </h2>
                    </div>
                    
                    {/* यहाँ प्रोग्रेस बार डालें */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-orange-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
        </div>
  );
};

export default StatsCard;