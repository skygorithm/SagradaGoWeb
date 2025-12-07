// utils/reportGenerator.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * Generate a PDF report.
 * @param {Object} params
 * @param {string} params.title - Report title
 * @param {Array} params.columns - Columns definition (AntD Table style)
 * @param {Array} params.data - Array of objects with report data
 */
export const generatePDFReport = ({ title, columns, data }) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Map columns for jsPDF
  const tableColumn = columns.map(col => col.dataIndex || col);
  const tableRows = data.map(row => tableColumn.map(col => row[col]));

  doc.autoTable({
    head: [columns.map(col => col.title || col)],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 10 },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
};

/**
 * Generate an Excel report.
 * @param {Object} params
 * @param {string} params.fileName - Filename without extension
 * @param {Array} params.data - Array of objects with report data
 */
export const generateExcelReport = ({ fileName, data }) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Universal report generator (choose type)
 * @param {Object} params
 * @param {"pdf"|"excel"} params.type - Report type
 * @param {string} params.title - Report title
 * @param {Array} params.columns - Columns definition
 * @param {Array} params.data - Report data
 */
export const generateReport = ({ type = "pdf", title, columns, data }) => {
  if (type === "pdf") {
    generatePDFReport({ title, columns, data });
  } else if (type === "excel") {
    generateExcelReport({ fileName: title, data });
  } else {
    console.error("Unsupported report type:", type);
  }
};
