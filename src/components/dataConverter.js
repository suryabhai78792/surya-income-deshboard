// src/dataConverter.js

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ध्यान दें: हमने यहाँ dataKey = 'income' जोड़ा है (यह डायनामिक है)
export function convertDataByMode(rawData, viewMode, dataKey = 'income') {
  const dataArray = Array.isArray(rawData) ? rawData : [];
  
  let baseHeading = "";
  let subHeaders = [];
  let processedData = {};

  // ========================================================
  // भाग 1: व्यू मोड के हिसाब से डेटा को ग्रुप करना
  // ========================================================
  if (viewMode === 'daily') {
    baseHeading = "महीना";
    subHeaders = Array.from({ length: 31 }, (_, i) => String(i + 1)); 
    monthNames.forEach(m => { processedData[m] = {}; });

    dataArray.forEach(item => {
      if (!item || !item.date) return;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return; 
      const mName = monthNames[d.getMonth()]; 
      const dateNum = String(d.getDate());     
      
      if (!processedData[mName][dateNum]) processedData[mName][dateNum] = 0;
      // 👈 यहाँ item.income की जगह item[dataKey] किया ताकि कोई भी की (key) रीड हो सके
      processedData[mName][dateNum] += Number(item[dataKey] || 0);
    });
  }
  else if (viewMode === 'yearly') {
    baseHeading = "साल";
    subHeaders = [...monthNames];

    dataArray.forEach(item => {
      if (!item || !item.date) return;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return; 
      const year = String(d.getFullYear());   
      const mName = monthNames[d.getMonth()]; 

      if (!processedData[year]) processedData[year] = {};
      if (!processedData[year][mName]) processedData[year][mName] = 0;
      // 👈 यहाँ भी item[dataKey] किया
      processedData[year][mName] += Number(item[dataKey] || 0);
    });
  } 
  else if (viewMode === 'final') {
    baseHeading = "Final"; 
    const validYears = dataArray
      .map(item => item && item.date ? new Date(item.date) : null)
      .filter(d => d && !isNaN(d.getTime()))
      .map(d => d.getFullYear());

    const yearsSet = new Set(validYears);
    subHeaders = Array.from(yearsSet).sort().map(String); 

    processedData["कुल साल"] = {};
    dataArray.forEach(item => {
      if (!item || !item.date) return;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return; 
      const year = String(d.getFullYear());
      
      if (!processedData["कुल साल"][year]) processedData["कुल साल"][year] = 0;
      // 👈 यहाँ भी item[dataKey] किया
      processedData["कुल साल"][year] += Number(item[dataKey] || 0);
    });
  }

  // ========================================================
  // भाग 2: चार्ट के लिए शुद्ध ऑब्जेक्ट तैयार करना
  // ========================================================
  const chartData = {
    headers: [...subHeaders], 
    processedData: { ...processedData }
  };

  // ========================================================
  // भाग 3: टेबल के लिए 2D Array (tableData) तैयार करना
  // ========================================================
  const tableData = [];
  const headerRow = [baseHeading, ...subHeaders, "Total"];
  tableData.push(headerRow);

  Object.keys(processedData).forEach(rowKey => {
    const rowValues = [];
    rowValues.push(rowKey); 

    let rowTotal = 0;
    subHeaders.forEach(subHeader => {
      const value = processedData[rowKey][subHeader] || 0;
      rowValues.push(value);
      rowTotal += Number(value); 
    });

    rowValues.push(rowTotal); 
    tableData.push(rowValues); 
  });

  return {
    tableData,
    chartData
  };
}
