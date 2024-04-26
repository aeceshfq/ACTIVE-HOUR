import moment from 'moment';
import * as XLSX from 'xlsx';

export function exportToExcel(data, filename) {
  // Create a new workbook and add a worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, filename);

  // Convert the workbook to an array buffer
  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create a Blob with the array buffer
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function exportToCSV(compiledData, fileName) {
  // Convert your data to CSV format

  // Create a Blob containing the CSV data
  const blob = new Blob([compiledData], { type: 'text/csv' });

  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary <a> element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  document.body.appendChild(a);

  // Trigger the download and remove the temporary <a> element
  a.click();
  document.body.removeChild(a);

  // Revoke the Blob URL to free up resources
  window.URL.revokeObjectURL(url);
}
