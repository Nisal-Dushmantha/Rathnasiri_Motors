import React, { useEffect, useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function ServiceRepairBillsList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  
  useEffect(() => {
    let isMounted = true;
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/service-repair-bills");
        if (!res.ok) throw new Error("Failed to load bills");
        const data = await res.json();
        if (isMounted) setBills(Array.isArray(data) ? data : []);
      } catch (e) {
        if (isMounted) setError(e.message || "Failed to load bills");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBills();
    return () => { isMounted = false; };
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatMoney = (n) => Number(n || 0).toFixed(2);
  const getId = (b, idx) => b._id || `${b.bill_no || 'LEG'}-${idx}`;
  
  // Group bills by month and year
  const groupedBillsByMonth = useMemo(() => {
    // Month names for display inside useMemo to avoid linting warning
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const groups = {};
    
    bills.forEach(bill => {
      if (!bill.date) return;
      
      const date = new Date(bill.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!groups[key]) {
        groups[key] = {
          monthName: monthNames[month],
          monthIndex: month,
          year,
          bills: []
        };
      }
      
      groups[key].bills.push(bill);
    });
    
    // Convert to array and sort by year then month index (chronological)
    return Object.values(groups).sort((a, b) => {
      return (a.year - b.year) || (a.monthIndex - b.monthIndex);
    });
  }, [bills]);

  // Function to generate and download PDF
  const handleDownloadPDF = (bill) => {
    const isNew = Array.isArray(bill.services) && bill.services.length > 0;
    const doc = new jsPDF();
    
    // Format date for display
    const billDate = bill.date ? new Date(bill.date).toLocaleDateString() : "-";
    const total = isNew 
      ? (bill.total ?? bill.services.reduce((s, r) => s + (Number(r.price || 0)), 0)) 
      : (Number(bill.price || 0));
    
    // Set document properties
    doc.setProperties({
      title: `Rathnasiri Motors - ${bill.type === 'repair' ? 'Repair' : 'Service'} Bill #${bill.bill_no || 'Unknown'}`,
      subject: 'Invoice',
      author: 'Rathnasiri Motors',
      creator: 'Rathnasiri Motors Management System'
    });
    
    // Add fancy header with blue background
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add company name in white on blue background
    doc.setTextColor(255, 255, 255); // White
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Rathnasiri Motors", 105, 20, { align: "center" });
    
    // Add bill type as subtitle in white
    doc.setFontSize(14);
    doc.text(`${bill.type === 'repair' ? 'Repair Bill' : 'Service Bill'}`, 105, 30, { align: "center" });
    
    // Reset text color to black for the rest of the document
    doc.setTextColor(0, 0, 0);
    
    // Add bill information section
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Left column - Customer details
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.text(bill.customerName || "Unknown Customer", 15, 57);
    
    // Right column - Bill details
    doc.setFont("helvetica", "bold");
    doc.text("BILL DETAILS:", 140, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Bill No: ${bill.bill_no || "-"}`, 140, 57);
    doc.text(`Date: ${billDate}`, 140, 64);
    
    // Add notes if available
    if (bill.notes) {
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(15, 70, 180, 15, 1, 1, 'FD');
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Notes: ${bill.notes}`, 20, 78);
    }
    
    // Add services table
    if (isNew && bill.services.length > 0) {
      const tableColumn = ["Item Description", "Price (Rs)"];
      const tableRows = [];
      
      // Add service rows
      bill.services.forEach(service => {
        tableRows.push([service.detail || "-", Number(service.price || 0).toFixed(2)]);
      });
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: bill.notes ? 90 : 75,
        headStyles: { 
          fillColor: [30, 58, 138], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'left'
        },
        foot: [["TOTAL", Number(total || 0).toFixed(2)]],
        footStyles: { 
          fillColor: [240, 249, 255], 
          textColor: [30, 58, 138], 
          fontStyle: 'bold',
          halign: 'left'
        },
        theme: 'grid',
        styles: {
          cellPadding: 6,
          fontSize: 11
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 40, halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });
    } else {
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(15, 75, 180, 10, 1, 1, 'FD');
      doc.text("No services found", 105, 82, { align: "center" });
    }
    
    // Add footer with border at the bottom
    const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : 120;
    
    // Add bottom border
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(15, finalY, 195, finalY);
    
    // Add thank you note
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Thank you for your business!", 105, finalY + 10, { align: "center" });
    
    // Add contact info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Rathnasiri Motors - Quality Service Excellence", 105, finalY + 20, { align: "center" });
    doc.text("Contact: +94 123 456 789 | Email: info@rathnasirimotors.com", 105, finalY + 25, { align: "center" });
    
    // Save the PDF
    doc.save(`Rathnasiri_Motors_Bill_${bill.bill_no || Date.now()}.pdf`);
  };

  // Function to generate monthly summary PDF
  const handleDownloadMonthlySummary = (monthData) => {
    const { monthName, year, bills } = monthData;
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Rathnasiri Motors - Monthly Summary ${monthName} ${year}`,
      subject: 'Monthly Invoice Summary',
      author: 'Rathnasiri Motors',
      creator: 'Rathnasiri Motors Management System'
    });
    
    // Add fancy header with blue background
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add company name in white on blue background
    doc.setTextColor(255, 255, 255); // White
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Rathnasiri Motors", 105, 20, { align: "center" });
    
    // Add report title as subtitle in white
    doc.setFontSize(14);
    doc.text(`Monthly Summary: ${monthName} ${year}`, 105, 30, { align: "center" });
    
    // Reset text color to black for the rest of the document
    doc.setTextColor(0, 0, 0);
    
    // Add summary information
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Summary stats
    const totalBills = bills.length;
    const serviceBills = bills.filter(b => b.type === 'service').length;
    const repairBills = bills.filter(b => b.type === 'repair').length;
    
    let totalAmount = 0;
    let serviceAmount = 0;
    let repairAmount = 0;
    
    bills.forEach(bill => {
      const isNew = Array.isArray(bill.services) && bill.services.length > 0;
      const amount = isNew 
        ? (bill.total ?? bill.services.reduce((s, r) => s + (Number(r.price || 0)), 0)) 
        : (Number(bill.price || 0));
        
      totalAmount += amount;
      if (bill.type === 'service') {
        serviceAmount += amount;
      } else if (bill.type === 'repair') {
        repairAmount += amount;
      }
    });
    
    // Summary box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 249, 255); // Light blue background
    doc.roundedRect(15, 50, 180, 40, 2, 2, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.text("MONTHLY SUMMARY", 105, 60, { align: "center" });
    doc.setFont("helvetica", "normal");
    
    doc.text(`Total Bills: ${totalBills}`, 25, 70);
    doc.text(`Service Bills: ${serviceBills}`, 25, 80);
    doc.text(`Repair Bills: ${repairBills}`, 120, 80);
    
    // Financial summary
    doc.setDrawColor(30, 58, 138);
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(15, 100, 180, 35, 2, 2, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("FINANCIAL SUMMARY", 105, 110, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Total Revenue: Rs. ${Number(totalAmount).toFixed(2)}`, 25, 120);
    doc.text(`Service Revenue: Rs. ${Number(serviceAmount).toFixed(2)}`, 25, 130);
    doc.text(`Repair Revenue: Rs. ${Number(repairAmount).toFixed(2)}`, 120, 130);
    
    // Add bills table
    const tableColumns = ["Bill No", "Date", "Customer", "Type", "Amount (Rs)"];
    const tableRows = bills.map(bill => {
      const isNew = Array.isArray(bill.services) && bill.services.length > 0;
      const total = isNew 
        ? (bill.total ?? bill.services.reduce((s, r) => s + (Number(r.price || 0)), 0)) 
        : (Number(bill.price || 0));
      const date = bill.date ? new Date(bill.date).toLocaleDateString() : "-";
      
      return [
        bill.bill_no || "-",
        date,
        bill.customerName || (bill.name || "-"),
        bill.type === 'repair' ? 'Repair' : 'Service',
        Number(total).toFixed(2)
      ];
    });
    
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 145,
      headStyles: { 
        fillColor: [30, 58, 138], 
        textColor: 255,
        fontStyle: 'bold'
      },
      theme: 'grid',
      styles: {
        cellPadding: 5,
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 25 },
        4: { cellWidth: 30, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });
    
    // Add footer with border at the bottom
    const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : 200;
    
    // Add bottom border
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(15, finalY, 195, finalY);
    
    // Add signature line
    doc.setFont("helvetica", "normal");
    doc.line(130, finalY + 25, 190, finalY + 25);
    doc.text("Authorized Signature", 160, finalY + 30, { align: "center" });
    
    // Add generation info
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, finalY + 40, { align: "center" });
    
    // Save the PDF
    doc.save(`Rathnasiri_Motors_Monthly_Summary_${monthName}_${year}.pdf`);
  };

  // Function to render a single bill
  const renderBill = (b, i) => {
    const id = getId(b, i);
    const isNew = Array.isArray(b.services) && b.services.length > 0;
    const total = isNew 
      ? (b.total ?? b.services.reduce((s, r) => s + (Number(r.price || 0)), 0)) 
      : (Number(b.price || 0));
    const date = b.date ? new Date(b.date).toISOString().slice(0, 10) : "-";
    const title = isNew ? `${b.bill_no || "-"} — ${b.customerName || "Unknown"}` : `${b.bill_no || "-"} — ${b.name || "-"}`;
    
    return (
      <div key={id} className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex flex-col">
          <button
            onClick={() => toggleExpand(id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100"
            aria-expanded={!!expanded[id]}
          >
            <div className="text-left">
              <div className="text-sm text-slate-500">{date}</div>
              <div className="text-base font-semibold text-slate-900">{title}</div>
              {isNew && b.type && (
                <div className="text-xs mt-1 inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">
                  {b.type === 'repair' ? 'Repair' : 'Service'}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Total</div>
              <div className="font-semibold">{formatMoney(total)}</div>
            </div>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadPDF(b);
            }}
            className="ml-auto mr-4 mb-2 px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Download PDF
          </button>
        </div>

        {expanded[id] && (
          <div className="px-4 py-3">
            {isNew ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-sm text-slate-600">
                      <th className="text-left py-2">{b.type === 'repair' ? 'Repair' : 'Service'} Description</th>
                      <th className="text-right py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.services.map((r, idx2) => (
                      <tr key={idx2} className="odd:bg-white even:bg-slate-50">
                        <td className="py-2 pr-2">{r.detail || "-"}</td>
                        <td className="py-2 pr-2 text-right">{formatMoney(r.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-slate-700">
                <div>Bill No: {b.bill_no || "-"}</div>
                <div>Customer: {b.customerName || "-"}</div>
                <div>Type: {b.type === 'repair' ? 'Repair' : 'Service'}</div>
                <div>Date: {date}</div>
                <div>Total: {formatMoney(total)}</div>
                {b.notes && <div>Notes: {b.notes}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Service & Repair Bills</h1>
          <div className="flex gap-2">
            <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              Service
            </div>
            <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              Repair
            </div>
          </div>
        </div>

        {loading && <div className="text-slate-600">Loading...</div>}
        {error && (
          <div className="p-4 mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && bills.length === 0 && (
          <div className="text-slate-600">No bills found.</div>
        )}

        {!loading && !error && bills.length > 0 && (
          <div className="space-y-8">
            {groupedBillsByMonth.map((monthGroup, idx) => (
              <div key={`${monthGroup.year}-${monthGroup.monthName}`} className="mb-6">
                <div className="flex items-center justify-between mb-3 pb-2 border-b">
                  <h2 className="text-xl font-semibold text-blue-800">
                    {monthGroup.monthName} {monthGroup.year}
                  </h2>
                  <button 
                    onClick={() => handleDownloadMonthlySummary(monthGroup)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center"
                    title="Download monthly summary report"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Monthly Summary
                  </button>
                </div>
                <div className="space-y-3">
                  {monthGroup.bills.map((b, i) => renderBill(b, i))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceRepairBillsList;