import jsPDF from "jspdf/dist/jspdf.umd.js";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const generatePDFReport = ({ title, columns, data }) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  autoTable(doc, {
    head: [columns.map(col => col.title || col)],
    body: data.map(row => columns.map(col => row[col.dataIndex])),
    startY: 30,
    styles: { fontSize: 10 },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
};

export const generateExcelReport = ({ fileName, data }) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const generateReport = ({ type = "pdf", title, columns, data }) => {
  if (type === "pdf") {
    generatePDFReport({ title, columns, data });
  } else if (type === "excel") {
    generateExcelReport({ fileName: title, data });
  } else {
    console.error("Unsupported report type:", type);
  }
};
