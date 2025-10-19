import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import axios from "axios";


function SparePBReports() {
  const [billsByMonth, setBillsByMonth] = useState({});

  const handleExportPDF = (monthKey) => {
    const monthBills = billsByMonth[monthKey];
    if (!monthBills || monthBills.length === 0) return;

    const doc = new jsPDF();
    const monthTitle = new Date(monthKey + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Current date and time for header
    const now = new Date();
    const currentDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('Spare Parts Bills Report', 105, 18, { align: 'center' });

    // Subtitle (Month)
    doc.setFontSize(13);
    doc.setTextColor(60, 60, 60);
    doc.text(monthTitle, 105, 28, { align: 'center' });
    
    // Generated date/time in header
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${currentDateTime}`, 105, 35, { align: 'center' });

    // Table data
    const tableData = monthBills.map((bill) => [
      bill.bill_no,
      new Date(bill.date).toLocaleDateString(),
      bill.customerName,
      bill.items.map(it => `${it.name} (${it.brand}) x${it.quantity} Rs. ${it.price}`).join("\n"),
      `Rs. ${bill.items.reduce((sum, it) => sum + it.quantity * it.price, 0).toFixed(2)}`
    ]);

    // Calculate total income for the month
    const totalIncome = monthBills.reduce((sum, bill) => {
      return sum + bill.items.reduce((s, it) => s + it.quantity * it.price, 0);
    }, 0);

    autotable(doc, {
      head: [["Bill No", "Date", "Customer Name", "Items", "Total"]],
      body: tableData,
      startY: 42,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 12,
        halign: 'center',
        valign: 'middle',
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'top',
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
      },
      alternateRowStyles: { fillColor: [240, 245, 255] },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        // Add total income row at the end, bold and blue
        doc.setFontSize(13);
        doc.setTextColor(37, 99, 235);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Income: Rs. ${totalIncome.toFixed(2)}`, 200, data.cursor.y + 15, { align: 'right' });
      }
    });

    doc.save(`SparePartsBills_${monthKey}.pdf`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/spb")
      .then((res) => {
        const raw = res.data.spb || [];

        // group by bill_no
        const grouped = raw.reduce((acc, item) => {
          let bill = acc.find((b) => b.bill_no === item.bill_no);
          if (!bill) {
            bill = {
              bill_no: item.bill_no,
              date: item.date,
              customerName: item.customerName,
              items: [],
            };
            acc.push(bill);
          }
          bill.items.push({
            name: item.name,
            brand: item.brand,
            quantity: item.quantity,
            price: item.price,
          });
          return acc;
        }, []);


        // Group bills by month (YYYY-MM)
        const byMonth = {};
        grouped.forEach((bill) => {
          const d = new Date(bill.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (!byMonth[key]) byMonth[key] = [];
          byMonth[key].push(bill);
        });
        setBillsByMonth(byMonth);
      })
      .catch((err) => console.error(err));
  }, []);


  const handleDelete = async (billNo, monthKey) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await axios.delete(`http://localhost:5000/spb/${billNo}`);
      alert("Bill deleted successfully.");
      setBillsByMonth(prev => {
        const updated = { ...prev };
        updated[monthKey] = updated[monthKey].filter(bill => bill.bill_no !== billNo);
        if (updated[monthKey].length === 0) {
          delete updated[monthKey];
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete bill.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Spare Parts Bills Report</h1>

        {Object.keys(billsByMonth)
          .sort((a, b) => b.localeCompare(a)) // newest month first
          .map((monthKey) => (
            <div key={monthKey} className="mb-10">
              <div className="flex items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-700 flex-1">
                  {new Date(monthKey + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  className="ml-4 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  onClick={() => handleExportPDF(monthKey)}
                >
                  Export PDF
                </button>
              </div>
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-gray-300 px-4 py-2">Bill No</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                    <th className="border border-gray-300 px-4 py-2">Items</th>
                    <th className="border border-gray-300 px-4 py-2">Total</th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billsByMonth[monthKey].map((bill, idx) => {
                    const total = bill.items.reduce(
                      (sum, it) => sum + it.quantity * it.price,
                      0
                    );
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{bill.bill_no}</td>
                        <td className="border px-4 py-2">
                          {new Date(bill.date).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">{bill.customerName}</td>
                        <td className="border px-4 py-2">
                          {bill.items.map((it, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 text-sm">
                              <span>{it.name}</span>
                              <span>{it.brand}</span>
                              <span>{it.quantity}</span>
                              <span>{it.price}</span>
                            </div>
                          ))}
                        </td>
                        <td className="border px-4 py-2 font-semibold">{total.toFixed(2)}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleDelete(bill.bill_no, monthKey)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SparePBReports;
