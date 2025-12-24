import jsPDF from "jspdf/dist/jspdf.umd.js";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const generatePDFReport = ({ title, columns, data }) => {
  try {
    const titleStr = typeof title === 'string' ? title : 'Report';
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(titleStr, 14, 22);

    if (!Array.isArray(columns) || columns.length === 0) {
      console.error('Invalid columns provided to generatePDFReport');
      return;
    }

    if (!Array.isArray(data)) {
      console.error('Invalid data provided to generatePDFReport');
      return;
    }

    autoTable(doc, {
      head: [columns.map(col => {
        if (typeof col === 'string') return col;
        return col.title || col.dataIndex || 'Column';
      })],
      body: data.map(row => columns.map(col => {
        if (typeof col === 'string') {
          return row[col] || '';
        }
        const value = row[col.dataIndex];

        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
      })),
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.save(`${titleStr.replace(/\s+/g, "_")}.pdf`);

  } catch (error) {
    console.error('Error generating PDF report:', error);
    alert('Failed to generate PDF report. Please check the console for details.');
  }
};

export const generateExcelReport = ({ fileName, data }) => {
  try {
    const fileNameStr = typeof fileName === 'string' ? fileName : 'Report';

    if (!Array.isArray(data)) {
      console.error('Invalid data provided to generateExcelReport');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${fileNameStr.replace(/\s+/g, "_")}.xlsx`);

  } catch (error) {
    console.error('Error generating Excel report:', error);
    alert('Failed to generate Excel report. Please check the console for details.');
  }
};

export const generateReport = ({ type = "pdf", title, columns, data }) => {
  try {
    if (type === "pdf") {
      if (!columns || !Array.isArray(columns)) {
        console.error('Columns are required for PDF reports');
        alert('Cannot generate PDF report: Invalid column configuration.');
        return;
      }
      generatePDFReport({ title, columns, data });

    } else if (type === "excel") {
      generateExcelReport({ fileName: title, data });

    } else {
      console.error("Unsupported report type:", type);
      alert(`Unsupported report type: ${type}`);
    }
    
  } catch (error) {
    console.error('Error in generateReport:', error);
    alert('Failed to generate report. Please check the console for details.');
  }
};
