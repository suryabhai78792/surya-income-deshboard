import React from 'react';
import { LayoutDashboard, Receipt, BarChart3, Settings, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
              // ---
import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto' // Chart.js को इम्पोर्ट किया
import './App.css'
import { convertDataByMode } from './components/dataConverter';
import MyButton from './components/MyButton';
import ReusableTable from './components/ReusableTable';

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];
              // ---

// --- डेटा और रंग ---
const originalPieData = [
  { name: 'Rent', value: 40 },
  { name: 'Food', value: 30 },
  { name: 'Travel', value: 20 },
  { name: 'Fun', value: 10 },
];

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

// --- मुख्य डैशबोर्ड कंपोनेंट ---
 function App() {

            // ---
 // स्टेट्स (States)

  const [pieData, setPieData] = useState(originalPieData);
  const [databaseData, setDatabaseData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const latestDataRef = useRef({}) // 🔥 लेटेस्ट डेटा को बिना री-रेंडर ट्रैक करने के लिए
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('Jan')
  const [incomeInput, setIncomeInput] = useState('')
   const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  
  const [viewMode, setViewMode] = useState('yearly'); // 'daily', 'yearly', 'final'
  const [dateInput, setDateInput] = useState(''); // YYYY-MM-DD फॉर्मेट के लिए


  // रीफ़्स (Refs) - डॉम एलिमेंट्स और चार्ट इंस्टेंस को ट्रैक करने के लिए
  const canvasRef = useRef(null);
  const activeChartInstance = useRef(null);
  const chartLoopInterval = useRef(null);
  const modalContainerRef = useRef(null)

  // API URLs
  const GET_DATA_URL = 'https://my-income-backend.onrender.com/getdata'
  const SAVE_DATA_URL = 'https://my-income-backend.onrender.com/save'

  const [isLoading, setIsLoading] = useState(true); // शुरू में लोडिंग दिखाएं

  // 1. सर्वर से टेबल और ग्राफ़ का डेटा लाना
    const loadDashboardData = () => {
      setIsLoading(true); // फेच शुरू होने पर लोडिंग ऑन करें
        fetch(GET_DATA_URL)
          .then(res => res.json())
          .then(data => {           
            setDatabaseData(data);
            latestDataRef.current = data; // 🔥 स्टेट के साथ-साथ रीफ़ में भी लेटेस्ट डेटा रख लें
            renderSnakeChart(data); // पहली बार में ग्राफ़ रेंडर करें
            setIsLoading(false); // डेटा आते ही लोडिंग बंद करें  
          })
          .catch(err => {
            console.error("लोड एरर:", err)
            setIsLoading(false); // डेटा आते ही लोडिंग बंद करें
          } )
      }

        // Input Validation Effect
  useEffect(() => {
    if (incomeInput.trim() !== "" && dateInput.trim() !== "") {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [incomeInput, dateInput]);

// 1. पहला इफेक्ट: सिर्फ स्क्रीन लोड होने पर बैकएंड से डेटा लाएगा
  useEffect(() => {
    loadTableData();
    return () => {
      if (chartLoopInterval.current) clearInterval(chartLoopInterval.current);
      if (activeChartInstance.current) activeChartInstance.current.destroy();
    };
  }, []);

  // 2. दूसरा इफेक्ट: जैसे ही tableData में डेटा आएगा, चार्ट तुरंत रेंडर होगा और लूप शुरू होगा
  useEffect(() => {
    if (databaseData && Object.keys(databaseData).length > 0) {
      startChartAutoLoop();
    }
  }, [databaseData]); // tableData के बदलते ही यह एक्टिव होगा

  // API: Load Table Data
  const loadTableData = () => {
       setIsLoading(true); // डेटा आते ही लोडिंग बंद करें
    fetch('https://my-income-backend.onrender.com/getdata')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
            setDatabaseData(data);
            latestDataRef.current = data; // 🔥 स्टेट के साथ-साथ रीफ़ में भी लेटेस्ट डेटा रख लें
            renderLiveChart(); // पहली बार में ग्राफ़ रेंडर करें.
            setIsLoading(false); // डेटा आते ही लोडिंग बंद करें         
  
      })
          .catch(err => {
            console.error("लोड एरर:", err)
            setIsLoading(false); // डेटा आते ही लोडिंग बंद करें
          } )
  };

  // 3. तीसरा नया इफेक्ट: जैसे ही viewMode बदलेगा, चार्ट तुरंत नए मोड के साथ रीस्टार्ट होगा
  useEffect(() => {
    // यह सुनिश्चित करेगा कि डेटा उपलब्ध होने पर ही लूप चले
    if (databaseData && Object.keys(databaseData).length > 0) {
      startChartAutoLoop(); // बटन दबाते ही तुरंत नया लूप शुरू और ग्राफ़ रीफ्रेश!
    }
  }, [viewMode]); // 👈 इसका मतलब है: जब भी viewMode बदले, यह कोड तुरंत चलाओ

        // Chart Loop Logic
  const startChartAutoLoop = () => {
    renderLiveChart();

    // 🎯 यहाँ जादू है: पहले पाई डेटा को खाली (Delete) किया, फिर तुरंत नया डेटा सेट किया
    setPieData([]); 
    setTimeout(() => setPieData(originalPieData), 10);

    if (chartLoopInterval.current) clearInterval(chartLoopInterval.current);
    chartLoopInterval.current = setInterval(() => {
      renderLiveChart();

    // 🎯 हर 12 सेकंड में पाई चार्ट का डेटा एक पल के लिए डिलीट होगा और फिर वापस आएगा
    setPieData([]); 
    setTimeout(() => setPieData(originalPieData), 10);

    }, 12000);
  };

  // 3. सांप की तरह स्मूथ चलने वाला बेजियर ग्राफ़ लॉजिक
  const generateBezierSmoothData = (dataList, totalSteps = 500) => {
    let smoothData = [];
    const n = dataList.length - 1;
    for (let step = 0; step <= totalSteps; step++) {
      let t = (step / totalSteps) * n;
      let i = Math.floor(t);
      if (i >= n) i = n - 1;
      let localT = t - i;

      let p0 = dataList[Math.max(0, i - 1)];
      let p1 = dataList[i];
      let p2 = dataList[Math.min(n, i + 1)];
      let p3 = dataList[Math.min(n, i + 2)];

      let y = 0.5 * (
        (2 * p1) +
        (-p0 + p2) * localT +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * localT * localT +
        (-p0 + 3 * p1 - 3 * p2 + p3) * localT * localT * localT
      );
      smoothData.push({ x: t, y: y });
    }
    return smoothData;
  }

  
const { tableData: convertedTableData } = convertDataByMode(databaseData, viewMode, 'income');


    const renderLiveChart = () => {
    if (typeof Chart === 'undefined' || !canvasRef.current) return;
      // यह चेक करेगा कि स्टेट में डेटा आ गया है या नहीं
      if (!databaseData || Object.keys(databaseData).length === 0) return;
  
      // 1. यहाँ हमने तीसरी वैल्यू 'income' पास की है। 
      // भविष्य में अगर आप 'sales' ट्रैक करना चाहें तो बस यहाँ 'sales' लिख देना!
      const { chartData } = convertDataByMode(databaseData, viewMode, 'income');
      const hArray = chartData.headers;
      const pData = chartData.processedData;

        let lastYearIncome = [0];
        let currentYearIncome = [0];

        // 2. टेबल की पहली दो रो (Rows) को viewMode के हिसाब से सही क्रम में निकालें
        let row1 = null;
        let row2 = null;

        if (viewMode === 'daily') {
          // अगर महीना व्यू (Daily) है, तो महीनों का सही क्रम (Chronological Order) सुनिश्चित करें
          const chronologicalMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          // pData में से सिर्फ वही महीने निकालें जो मौजूद हैं और उनका क्रम सही रखें
          const availableMonths = chronologicalMonths.filter(m => pData.hasOwnProperty(m));
          
          row1 = availableMonths[0] || null;
          row2 = availableMonths[1] || null; // यहाँ आपको जनवरी और फरवरी (या जो भी पहले दो महीने उपलब्ध हैं) मिल जाएंगे
        } else {
          // 'yearly' या 'final' मोड के लिए सालों को न्यूमेरिकल (संख्या के आधार पर) सॉर्ट करें (उदा: 2025, 2026)
          const availableYears = Object.keys(pData).sort((a, b) => Number(a) - Number(b));
          
          row1 = availableYears[0] || null;
          row2 = availableYears[1] || null;
        }
        

        // 3. टेबल की हेडिंग्स (Headers) के हिसाब से सीधे सेल का डेटा ग्राफ़ में डालना
        hArray.forEach(h => {
          if (h === 'Total') return; // 👈 यहाँ 'Total' को रोकना जरूरी है क्योंकि यह सिर्फ टेबल की हेडिंग में है, डेटा में नहीं।
          
          // पहली रो का डेटा डालना
          let val1 = row1 && pData[row1] && pData[row1][h] ? Number(pData[row1][h]) : 0;
          lastYearIncome.push(val1);

          // दूसरी रो का डेटा डालना (अगर दूसरी रो उपलब्ध हो)
          if (row2) {
            let val2 = pData[row2] && pData[row2][h] ? Number(pData[row2][h]) : 0;
            currentYearIncome.push(val2);
          }
        });

        const smoothLastYear = generateBezierSmoothData(lastYearIncome);
        const smoothCurrentYear = generateBezierSmoothData(currentYearIncome);
        const totalDuration = 5000;
        const delayPerPoint = totalDuration / smoothLastYear.length;

        if (activeChartInstance.current) {
          activeChartInstance.current.destroy();
        }

        const glowingEffectPlugin = {
          id: 'glowingEffect',
          beforeDatasetsDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            chart.data.datasets.forEach((dataset) => {
              ctx.shadowColor = dataset.borderColor;
              ctx.shadowBlur = 18;
            });
          },
          afterDatasetsDraw(chart) {
            const { ctx } = chart;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              let lastVisiblePoint = null;
              for (let i = meta.data.length - 1; i >= 0; i--) {
                if (meta.data[i] && !meta.data[i].skip && meta.data[i].x !== undefined) {
                  if (i > 0 && meta.data[i].x > meta.data[i - 1].x) {
                    lastVisiblePoint = meta.data[i];
                    break;
                  }
                }
              }
              if (lastVisiblePoint) {
                const x = lastVisiblePoint.x;
                const y = lastVisiblePoint.y;
                ctx.beginPath();
                ctx.arc(x, y, 11, 0, 2 * Math.PI);
                ctx.fillStyle = dataset.borderColor === '#00d2ff' ? 'rgba(0, 210, 255, 0.35)' : 'rgba(149, 165, 166, 0.35)';
                ctx.shadowBlur = 25;
                ctx.shadowColor = dataset.borderColor;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 5.5, 0, 2 * Math.PI);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 12;
                ctx.shadowColor = dataset.borderColor;
                ctx.fill();
              }
            });
            ctx.restore();
          }
        };

        const ctx = canvasRef.current.getContext('2d');
        activeChartInstance.current = new Chart(ctx, {
          type: 'line',
          plugins: [glowingEffectPlugin],
          data: {
            datasets: [
              {
                label: row1 ? `डेटा: ${row1}` : 'रो 1', // स्वचालित रूप से 2025 या Jan दिखाएगा
                data: smoothLastYear,
                borderColor: '#95a5a6',
                backgroundColor: 'transparent',
                borderWidth: 4,
                tension: 0,
                pointRadius: 0,
                pointStyle: false,
                showLine: true
              },
              {
                label: row2 ? `डेटा: ${row2}` : 'रो 2', // स्वचालित रूप से 2026 या Feb दिखाएगा
                data: smoothCurrentYear,
                borderColor: '#00d2ff',
                backgroundColor: 'transparent',
                borderWidth: 4,
                tension: 0,
                pointRadius: 0,
                pointStyle: false,
                showLine: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              x: {
                type: 'number',
                easing: 'linear',
                duration: delayPerPoint,
                from: NaN,
                delay: (ctx) => {
                  if (ctx.type !== 'data' || ctx.xStarted) return 0;
                  ctx.xStarted = true;
                  if (ctx.datasetIndex === 0) return ctx.index * delayPerPoint;
                  return totalDuration + (ctx.index * delayPerPoint);
                }
              },
              y: { duration: 0 }
            },
            scales: {
              x: {
                type: 'linear',
                min: 0,
                // 'Total' कॉलम को हटाकर बचे हुए लेबल्स की गिनती
                max: hArray.filter(h => h !== 'Total').length, 
                title: { display: true, text: 'टाइमलाइन' },
                ticks: {
                  stepSize: 1,
                  callback: value => {
                    // 'Total' को हटाकर सिर्फ शुद्ध हेडिंग्स (1-31, या Jan-Dec) को ग्राफ़ के नीचे दिखाना
                    const pureHeaders = ['0', ...hArray.filter(h => h !== 'Total')];
                    return pureHeaders[value] || '';
                  }
                }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'कुल कमाई (₹ में)' },
                ticks: { callback: value => '₹' + value.toLocaleString('en-IN') }
              }
            }
          }
        }); // यहाँ चार्ट का कोड खत्म हुआ.
  }
   

  // API: Save Data
  const saveData = () => {
    fetch('https://my-income-backend.onrender.com/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateInput, income: Number(incomeInput) })
    })
    .then(res => {
      if (!res.ok) throw new Error("सेव करने में गड़बड़");
      setIncomeInput("");
      setShowModal(false);
      loadTableData();
      renderLiveChart(); // तुरंत ग्राफ़ रीफ्रेश करें
    })
    .catch(err => {
      console.error(err);
      alert("डेटा सेव नहीं हो पाया!");
    });
  };


  // 5. बैकअप डेटा डाउनलोड लॉजिक
  const handleDownloadBackup = () => {
    fetch(GET_DATA_URL)
      .then(res => res.json())
      .then(data => {
        let blob = new Blob([JSON.stringify(data)], {type: "application/json"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "MyIncomeData.json";
        a.click();
      });
  }

  // 6. ड्रैगेबल मोडल हेडर फंक्शनलिटी (रिएक्ट वे)
  const handleMouseDown = (e) => {
    if (window.innerWidth < 600) return; 
    const container = modalContainerRef.current;
    if (!container) return;

    let offsetX = e.clientX - container.offsetLeft;
    let offsetY = e.clientY - container.offsetTop;

    function mouseMoveHandler(e) {
      container.style.position = "absolute";
      container.style.left = (e.clientX - offsetX) + "px";
      container.style.top = (e.clientY - offsetY) + "px";
      container.style.margin = "0";
    }

    function mouseUpHandler() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
            // ---


  return (
    // 'bg-gray-100' से बैकग्राउंड ग्रे होगा और 'p-8' से पैडिंग आएगी
    <div className="bg-gray-100 min-h-screen">
      {/* यहाँ अपने चार्ट और कार्ड्स को क्लास दें */}

      {/* 1. साइडबार भाग */}
      <div className="bg-white shadow-md p-6 border-b border-gray-300">
         <h1 className="text-2xl font-bold text-blue-600 ">Finance Tracker </h1>
      </div>
      <div className="flex h-screen bg-gray-50">      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-300 p-6">
        
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 mb-6 flex items-center justify-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Add Transaction 
        </button>
        

        <nav className="space-y-4">
          <div className="flex items-center gap-3 text-blue-600 font-semibold"><LayoutDashboard size={20}/> Dashboard</div>
          <div className="flex items-center gap-3 text-gray-600"><Receipt size={20}/> Transactions</div>
          <div className="flex items-center gap-3 text-gray-600"><BarChart3 size={20}/> Reports</div>
          <div className="flex items-center gap-3 text-gray-600"><Settings size={20}/> Settings</div>

          <div className="flex items-center gap-3 text-gray-600 cursor: pointer" onClick={() => setViewMode('daily')}             style={{ 
              fontWeight: viewMode === 'daily' ? 'bold' : 'normal',
              color: viewMode === 'daily' ? 'blue' : 'gray' 
            }} >📅महीना व्यू (तारीख वार) </div>
          <div className="flex items-center gap-3 text-gray-600 cursor: pointer" onClick={() => setViewMode('yearly')}             style={{ 
              fontWeight: viewMode === 'yearly' ? 'bold' : 'normal',
              color: viewMode === 'yearly' ? 'blue' : 'gray' 
            }}>📈साल व्यू (महीने वार) </div>

          <div className="flex items-center gap-3 text-gray-600 cursor: pointer" onClick={() => setViewMode('final')}             style={{ 
              fontWeight: viewMode === 'final' ? 'bold' : 'normal',
              color: viewMode === 'final' ? 'blue' : 'gray' 
            }}>💰फाइनल इनकम व्यू </div>
          
        </nav>
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 flex items-center justify-center gap-2" onClick={handleDownloadBackup}>
          डेटा बैकअप (JSON)
        </button>

      </div>


      {/* 2. मुख्य कंटेंट क्षेत्र */}
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Stats Cards */}

        {/* 3. इनकम और एक्सपेंस बॉक्स */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-green-300">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-2xl font-bold">₹2,84,345</h2>
          </div>
          <div className="bg-white p-4 rounded-xl border border-red-300">
            <p className="text-sm text-gray-500">Total Expense</p>
            <h2 className="text-2xl font-bold text-red-500">₹1,89,234</h2>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-300">
            <p className="text-sm text-gray-500">Savings</p>
            <h2 className="text-2xl font-bold text-red-500">₹95111</h2>
          </div>
          <div className="bg-white p-4 rounded-xl border border-yellow-300">
            <p className="text-sm text-gray-500">Budget Balance</p>
            <h2 className="text-2xl font-bold text-red-500">₹20000</h2>
          </div>
          {/* ... अन्य कार्ड्स इसी तरह जोड़ें ... */}
        </div>

        {/* Charts Section */}
        {/* 4. चार्ट्स का भाग */}
        <div className="grid grid-cols-3 gap-6">
          {/* लाइन चार्ट भाग */}

          <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-300">        
            <h3 style={{ color: "#1a237e", marginTop: "0", marginBottom: "15px", fontSize: "16px", textAlign: "left" }}>वार्षिक इनकम प्रोग्रेस ग्राफ़ (प्रत्येक 5s में रीस्टार्ट) 📈</h3>
          <div className="chart-container" style={{ 
            height: window.innerWidth < 600 ? "200px" : "300px", 
            position: "relative" 
            }}>
            {/* लोडिंग व्हील ओवरले */}
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>सर्वर जाग रहा है, कृपया प्रतीक्षा करें... ⏳</p>
              </div>
              )}
            <canvas ref={canvasRef} id="incomeChart"></canvas>            
          </div>
        

            {/* यहाँ आप Recharts का LineChart डाल सकते हैं */}
          </div>
  {/* पाई चार्ट भाग */}
          <div className="bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="font-bold mb-4">Category-wise Expense</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>


          
        </div>

        <div className="table-responsive" className="bg-white p-6 mt-6 rounded-xl border border-gray-300">
          <ReusableTable data={convertedTableData} />
        </div>


      </div>


  {/* Entry Modal */}
      {showModal && (
        <div id="entryModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" id="modalContainer" ref={modalRef}>
            <div className="modal-header draggable-header" id="modalHeader" onMouseDown={handleMouseDown}>
              नई एंट्री जोड़ें 📝
              <span onClick={() => setShowModal(false)} style={{ float: 'right', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}>×</span>
            </div>
                          <div className="modal-body">
                            {/* 1. तारीख चुनने के लिए कैलेंडर बॉक्स */}
                            <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', fontWeight: 'bold' }}>तारीख चुनें (Date):</label>
                            <input 
                              type="date" 
                              value={dateInput} 
                              onChange={(e) => setDateInput(e.target.value)} 
                              style={{ padding: '8px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}
                            />

                            {/* 2. कमाई की राशि डालने के लिए इनपुट बॉक्स (जो छूट गया था) */}
                            <label style={{ display: 'block', marginBottom: '5px', textAlign: 'left', fontWeight: 'bold' }}>कमाई की राशि (₹):</label>
                            <input
                              type="number"
                              id="incomeInput"
                              placeholder="राशि दर्ज करें (जैसे: 5000)"
                              value={incomeInput}
                              onChange={(e) => setIncomeInput(e.target.value)}
                              style={{ padding: '8px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' }}
                            />

                            {/* 3. सेव करने का बटन */}
                            <button
                              className="btn-save"
                              id="saveBtn"
                              onClick={saveData}
                              disabled={isSaveDisabled}
                              style={{ 
                                backgroundColor: isSaveDisabled ? '#ccc' : '#00d2ff', 
                                width: '100%', 
                                padding: '10px', 
                                color: '#fff', 
                                border: 'none', 
                                cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              सेव करें
                            </button>
                          </div>
          </div>
        </div>
      )}


    </div>
    </div>

    


  );
}
export default App;

