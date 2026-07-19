import React from 'react';
import './StatsCard.css';
import { useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';


const StatsCard = ({ income, expense, savings, budget }) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // यह फंक्शन पता लगाता है कि अभी कौन सा कार्ड सेंटर में है
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      // इंडेक्स कैलकुलेट करना
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };


  return (


<div className="flex flex-col gap-4">
      {/* 1. कार्ड्स वाला हिस्सा */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible"
      >
        {/* आपके चारों कार्ड्स यहाँ आएंगे */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-700 w-[85vw] min-w-[280px] flex-shrink-0 lg:w-auto snap-center">
            <p className="font-bold">कुल आय <span className="font-normal text-gray-500">(Total Income)</span></p>
            <h2 className="text-2xl font-bold">₹{income}</h2>            
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-green-700">+5.2%</span><TrendingUp size={14} className="mr-1 text-green-700" /></p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-700 w-[85vw] min-w-[280px] flex-shrink-0 lg:w-auto snap-center">
            <p className="font-bold">कुल खर्च <span className="font-normal text-gray-500">(Total Expense)</span></p>
            <h2 className="text-2xl font-bold">₹{expense}</h2>
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap">पिछले महीने से <span className="font-normal text-red-700"> +8.1% </span> <TrendingUp size={14} className="mr-1 text-red-700" /></p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-700 w-[85vw] min-w-[280px] flex-shrink-0 lg:w-auto snap-center">
            <p className="font-bold">बचत <span className="font-normal text-gray-500">(Savings)</span></p>
            <h2 className="text-2xl font-bold">₹{savings}</h2>
            <p className="flex items-center gap-1 mt-1 whitespace-nowrap text-blue-500">बजट से अधिक</p>
          </div>
                <div className="h-full p-[1px] rounded-xl bg-gradient-to-r from-gray-500 to-orange-400 w-[85vw] min-w-[280px] flex-shrink-0 lg:w-auto snap-center">                  
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

      {/* 2. डॉट्स (Indicators) वाला हिस्सा - जो मोबाइल पर दिखेगा */}
      <div className="flex justify-center mb-2 gap-2 lg:hidden" >
        {[0, 1, 2, 3].map((index) => (
          <div 
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              activeIndex === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>



  );
};

export default StatsCard;