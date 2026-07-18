import React from 'react';
import './ReusableTable.css';


export default function ReusableTable({ data}) {



   // सुरक्षा चेक: अगर डेटा नहीं आया है या खाली है, तो कुछ मत दिखाओ
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center p-4">कोई डेटा उपलब्ध नहीं है।</p>;
  }

  // 1. कनवर्टर से आई पहली रो हमेशा हेडर होती है (जैसे: ["साल", "Jan", "Feb", ..., "Total"])
  const headers = data[0];

  // 2. पहली रो को छोड़कर बाकी की सभी रोज़ हमारा असली डेटा हैं
  const rows = data.slice(1);


  // --- रेंडरिंग (HTML/JSX) ---
  return (
    <div className="table-responsive" >
      <table id="incomeTable">
          <thead>
            <tr id="headerRow">
              {/* सीधे headers पर लूप चलाएं, क्योंकि पहला शब्द (साल/महीना) और आखिरी शब्द (Total) इसी में है */}
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className={header === 'Total' ? 'total-cell' : (index === 0 ? 'year-cell' : '')}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody id="tableBody">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  // 1. पहला बॉक्स (इंडेक्स 0) हमेशा साल या महीना होता है
                  if (cellIndex === 0) {
                    return <td key={cellIndex} className="year-cell">{cell}</td>;
                  }

                  // 2. आखिरी बॉक्स हमेशा 'Total' कॉलम का होता है
                  if (cellIndex === row.length - 1) {
                    return (
                      <td key={cellIndex} className="total-cell">
                        {Number(cell) ? cell.toLocaleString('en-IN') : "0"}
                      </td>
                    );
                  }

                  // 3. बीच के बाकी सभी बॉक्स (महीने या दिनों की वैल्यूज)
                  return (
                    <td key={cellIndex}>
                      {cell !== "" && Number(cell) !== 0 ? Number(cell).toLocaleString('en-IN') : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
      </table>

    </div>
  );
}