import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto' // Chart.js को इम्पोर्ट किया
import './App.css'

const MONTHS_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];

function App() {
  // स्टेट्स (States)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState({})
  const latestDataRef = useRef({}) // 🔥 लेटेस्ट डेटा को बिना री-रेंडर ट्रैक करने के लिए
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedMonth, setSelectedMonth] = useState('Jan')
  const [incomeAmount, setIncomeAmount] = useState('')

  // रीफ़्स (Refs) - डॉम एलिमेंट्स और चार्ट इंस्टेंस को ट्रैक करने के लिए
  const chartCanvasRef = useRef(null)
  const activeChartRef = useRef(null)
  const chartIntervalRef = useRef(null)
  const modalContainerRef = useRef(null)

  // API URLs
  const GET_DATA_URL = 'https://my-income-backend.onrender.com/getdata'
  const SAVE_DATA_URL = 'https://my-income-backend.onrender.com/save'

  // 1. सर्वर से टेबल और ग्राफ़ का डेटा लाना
    const loadDashboardData = () => {
        fetch(GET_DATA_URL)
          .then(res => res.json())
          .then(data => {
            setTableData(data);
            latestDataRef.current = data; // 🔥 स्टेट के साथ-साथ रीफ़ में भी लेटेस्ट डेटा रख लें
            renderSnakeChart(data); // पहली बार में ग्राफ़ रेंडर करें
          })
          .catch(err => console.error("लोड एरर:", err))
      }

    // 2. कंपोनेंट लोड होने पर डेटा लाना और 12 सेकेंड का ग्राफ़ लूप शुरू करना
    useEffect(() => {
        loadDashboardData();

        // हर 12 सेकंड में केवल ग्राफ को री-एनिमेट करने का इंटरवल
        chartIntervalRef.current = setInterval(() => {
          if (activeChartRef.current && Object.keys(latestDataRef.current).length > 0) {
            // 🔥 यहाँ हम लेटेस्ट डेटा रीफ़ से उठा रहे हैं, जिससे न तो ब्लिंकिंग होगी और न इन्फिनिट लूप!
            renderSnakeChart(latestDataRef.current); 
          }
        }, 12000);

        return () => {
          if (chartIntervalRef.current) clearInterval(chartIntervalRef.current);
          if (activeChartRef.current) activeChartRef.current.destroy();
        }
      }, []); // 💡 यह खाली रहेगा, जिससे ऐप मक्खन की तरह स्मूथ चलेगा

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

  const renderSnakeChart = (data) => {
    if (!chartCanvasRef.current) return;

    const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastYearIncome = [0];
    let currentYearIncome = [0];

    monthKeys.forEach(m => {
      let val2025 = data["2025"] && data["2025"][m] ? Number(data["2025"][m]) : 0;
      lastYearIncome.push(val2025);

      let val2026 = data["2026"] && data["2026"][m] ? Number(data["2026"][m]) : 0;
      currentYearIncome.push(val2026);
    });

    const smoothLastYear = generateBezierSmoothData(lastYearIncome);
    const smoothCurrentYear = generateBezierSmoothData(currentYearIncome);
    const totalDuration = 5000; 
    const delayPerPoint = totalDuration / smoothLastYear.length;

    // पुराना चार्ट नष्ट करना (Destroy)
    if (activeChartRef.current) {
      activeChartRef.current.destroy();
    }

    // ग्लोइंग इफ़ेक्ट प्लगइन
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
              if (i > 0 && meta.data[i].x > meta.data[i-1].x) {
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

    const ctx = chartCanvasRef.current.getContext('2d');
    const monthsLabels = ['0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    activeChartRef.current = new Chart(ctx, {
      type: 'line',
      plugins: [glowingEffectPlugin],
      data: {
        datasets: [
          {
            label: 'पिछले साल (2025)',
            data: smoothLastYear,
            borderColor: '#95a5a6', 
            backgroundColor: 'transparent',
            borderWidth: window.innerWidth < 600 ? 2 : 4,
            pointRadius: 0,
            showLine: true
          },
          {
            label: 'इस साल (2026)',
            data: smoothCurrentYear,
            borderColor: '#00d2ff', 
            backgroundColor: 'transparent',
            borderWidth: window.innerWidth < 600 ? 2 : 5,
            pointRadius: 0,
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
            max: monthsLabels.length - 1,
            // मोबाइल पर 'महीने' का टाइटल छुपाने के लिए
            title: { 
              display: window.innerWidth > 600, 
              text: 'महीने (Months)' 
            },
            ticks: {
              stepSize: 1,
              callback: value => monthsLabels[value]
            }
          },
          y: {
            beginAtZero: true,
            // मोबाइल पर 'कुल कमाई' का टाइटल छुपाने के लिए
            title: { 
              display: window.innerWidth > 600, 
              text: 'कुल कमाई (₹ में)' 
            },
            ticks: { callback: value => '₹' + value.toLocaleString('en-IN') }
          }
        }
      }
    });
  }

  // 4. नया डेटा सेव करना
  const handleSaveData = () => { 
    fetch(SAVE_DATA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: selectedYear, month: selectedMonth, income: incomeAmount })
    })
    .then(res => {
      if (!res.ok) throw new Error("सेव करने में गड़बड़");
      setIncomeAmount("");
      //setIsModalOpen(false); 
      loadDashboardData(); // रीफ्रेश टेबल एंड ग्राफ़
    })
    .catch(err => {
      console.error(err);
      alert("डेटा सेव नहीं हो पाया!");
    });
  }

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

  return (
    <>
      <div className="dashboard-card">
        <h2>इनकम रिपोर्ट (एक्सेल स्टाइल) 📊</h2>
        
        <div className="btn-container">
          <button className="btn-Style" onClick={() => setIsModalOpen(true)}>+ नई एंट्री जोड़ें 📝</button>
          <button className="btn-Style" onClick={handleDownloadBackup}>डेटा बैकअप (JSON)</button>
        </div>

        <div className="main-chart-wrapper" style={{ background: "#ffffff", padding: "15px", borderRadius: "12px", marginBottom: "20px", boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)" }}>
          <h3 style={{ color: "#1a237e", marginTop: "0", marginBottom: "15px", fontSize: "16px", textAlign: "left" }}>वार्षिक इनकम प्रोग्रेस ग्राफ़ (प्रत्येक 5s में रीस्टार्ट) 📈</h3>
          <div className="chart-container" style={{ 
            height: window.innerWidth < 600 ? "200px" : "300px", 
            position: "relative" 
            }}>
            <canvas ref={chartCanvasRef} id="incomeChart"></canvas>
          </div>
        </div>
        
        <div className="table-responsive">
          <table id="incomeTable">
            <thead>
              <tr id="headerRow">
                <th className="year-cell">साल</th>
                {MONTHS_LIST.map((m, i) => (
                  <th key={i} className={m === 'Total' ? 'total-cell' : ''}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map((year) => {
                let yearlyTotal = 0;
                return (
                  <tr key={year}>
                    <td className="year-cell">{year}</td>
                    {MONTHS_LIST.map((m) => {
                      if (m !== 'Total') {
                        let monthValue = tableData[year]?.[m] ? Number(tableData[year][m]) : 0;
                        yearlyTotal += monthValue;
                        return <td key={m}>{tableData[year]?.[m] || "-"}</td>;
                      } else {
                        return <td key={m} className="total-cell">{yearlyTotal > 0 ? yearlyTotal.toLocaleString('en-IN') : "-"}</td>;
                      }
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* मोडल पॉप-अप */}
      <div id="entryModal" className="modal" style={{ display: isModalOpen ? 'flex' : 'none' }}>
        <div ref={modalContainerRef} className="modal-content" id="modalContainer">
          <div className="modal-header draggable-header" onMouseDown={handleMouseDown} style={{ cursor: 'move' }}>
             नई एंट्री जोड़ें 📝
            <span onClick={() => setIsModalOpen(false)} style={{ float: 'right', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}>×</span>
          </div>
          <div className="modal-body">
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {MONTHS_LIST.filter(m => m !== 'Total').map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="कमाई की राशि (₹)" 
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
            />
            <button 
              className="btn-save" 
              onClick={handleSaveData} 
              disabled={!incomeAmount.trim()}
              style={{ backgroundColor: incomeAmount.trim() ? '#00d2ff' : '#ccc' }}
            >
              सेव करें
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;