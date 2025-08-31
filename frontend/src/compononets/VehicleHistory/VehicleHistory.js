// JobCardPDF.js
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function JobCardPDF() {
  const { id } = useParams(); // Job ID from URL
  const [job, setJob] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/repairs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    fetchJob();
  }, [id]);

  const downloadPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`JobCard_${job.Name}_${job.VehicleNumber}.pdf`);
  };

  if (!job) return <p className="p-10 text-center">Loading Job Card...</p>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Job Card for PDF */}
      <div
        ref={pdfRef}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border border-gray-300"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          Vehicle Repair Job Card
        </h1>
        <div className="space-y-3 text-gray-700">
          <p><strong>Job ID:</strong> {job._id}</p>
          <p><strong>Customer Name:</strong> {job.Name}</p>
          <p><strong>Phone:</strong> {job.Phone}</p>
          <p><strong>Vehicle Type:</strong> {job.VehicleType}</p>
          <p><strong>Model:</strong> {job.Model}</p>
          <p><strong>Vehicle Number:</strong> {job.VehicleNumber}</p>
          <p><strong>Details:</strong> {job.Details}</p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadPDF}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
}

export default JobCardPDF;
