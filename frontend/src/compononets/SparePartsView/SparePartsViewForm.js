import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
function SparePartsViewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBarcode, setShowBarcode] = useState(false);
  const barcodeRef = useRef();

  // Fetch part details
  useEffect(() => {
    const fetchPart = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/sp/${id}`);
        setPart(res.data.sp);
      } catch (err) {
        console.error("Error fetching part details:", err);
        alert("Failed to fetch part details!");
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  // Generate labeled barcode when popup opens
  useEffect(() => {
    if (!(showBarcode && part && barcodeRef.current)) return;

    const parentSvg = barcodeRef.current;

    // Clear previous content
    while (parentSvg.firstChild) parentSvg.removeChild(parentSvg.firstChild);

    // Label layout constants
    const labelWidth = 320; // px
    const padding = 10;
    const topTextHeight = 18;
    const gapBetweenTopAndBarcode = 6;
    const barcodeHeight = 60;
    const gapBetweenBarcodeAndBottom = 6;
    const bottomTextHeight = 18;
    const totalHeight =
      padding +
      topTextHeight +
      gapBetweenTopAndBarcode +
      barcodeHeight +
      gapBetweenBarcodeAndBottom +
      bottomTextHeight +
      padding;

    parentSvg.setAttribute("width", String(labelWidth));
    parentSvg.setAttribute("height", String(totalHeight));
    parentSvg.setAttribute("viewBox", `0 0 ${labelWidth} ${totalHeight}`);
    parentSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Top title text
    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.setAttribute("x", String(labelWidth / 2));
    titleText.setAttribute("y", String(padding + topTextHeight));
    titleText.setAttribute("text-anchor", "middle");
    titleText.setAttribute("font-size", "16");
    titleText.setAttribute("font-weight", "700");
    titleText.textContent = "Rathnasiri Motors";
    parentSvg.appendChild(titleText);

    // Container group for barcode (we will set X after rendering for perfect centering)
    const barcodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const barcodeY = padding + topTextHeight + gapBetweenTopAndBarcode;
    parentSvg.appendChild(barcodeGroup);

    // Inner SVG for JsBarcode to render into
    const innerSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    innerSvg.setAttribute("x", "0");
    innerSvg.setAttribute("y", "0");
    innerSvg.setAttribute("width", String(labelWidth));
    innerSvg.setAttribute("height", String(barcodeHeight));
    barcodeGroup.appendChild(innerSvg);

    // Render barcode without the default human-readable value
    JsBarcode(innerSvg, part.barcode || "", {
      format: "CODE128",
      width: 2,
      height: barcodeHeight,
      displayValue: false,
      margin: 0,
    });

    // Center the barcode horizontally within the fixed label width
    try {
      const bbox = innerSvg.getBBox();
      const actualWidth = bbox.width || labelWidth;
      const offsetX = Math.max(0, (labelWidth - actualWidth) / 2);
      barcodeGroup.setAttribute("transform", `translate(${offsetX}, ${barcodeY})`);
    } catch (e) {
      // Fallback: no getBBox available, align left at padding
      barcodeGroup.setAttribute("transform", `translate(0, ${barcodeY})`);
    }

    // Bottom text: item name and price
    const bottomText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    bottomText.setAttribute("x", String(labelWidth / 2));
    bottomText.setAttribute(
      "y",
      String(barcodeY + barcodeHeight + gapBetweenBarcodeAndBottom + bottomTextHeight)
    );
    bottomText.setAttribute("text-anchor", "middle");
    bottomText.setAttribute("font-size", "14");
    bottomText.setAttribute("font-weight", "600");
    const price = part.price != null ? `Rs. ${part.price}` : "";
    bottomText.textContent = `${part.name || ""} ${price ? "- " + price : ""}`.trim();
    parentSvg.appendChild(bottomText);
  }, [showBarcode, part]);

  // Delete part
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this spare part?")) return;
    try {
      await axios.delete(`http://localhost:5000/sp/${id}`);
      alert("Spare part deleted successfully!");
      navigate("/SparePartsDisplay");
    } catch (err) {
      console.error("Error deleting part:", err);
      alert("Failed to delete part!");
    }
  };

  // Download barcode as PDF
  const handleDownloadPDF = () => {
    if (!barcodeRef.current) return;
    const svgElement = barcodeRef.current;

    // Prefer viewBox dimensions if present
    const viewBox = svgElement.getAttribute("viewBox");
    let width = 320;
    let height = 120;
    if (viewBox) {
      const parts = viewBox.split(" ").map(Number);
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    } else {
      const bbox = svgElement.getBoundingClientRect();
      width = Math.ceil(bbox.width) || width;
      height = Math.ceil(bbox.height) || height;
    }

    const pdf = new jsPDF({
      orientation: width >= height ? "landscape" : "portrait",
      unit: "pt",
      format: [width, height],
    });
    pdf.svg(svgElement, { x: 0, y: 0 }).then(() => {
      pdf.save(`barcode-${part?.barcode || "label"}.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading part details...
      </div>
    );
  }

  if (!part) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-600 font-semibold">
        Spare part not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-8 flex justify-center">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Spare Part Details
        </h2>

        {/* Display part details in form-like structure */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Name</label>
            <p className="w-full px-4 py-3 border rounded-xl bg-gray-50">{part.name}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Brand</label>
            <p className="w-full px-4 py-3 border rounded-xl bg-gray-50">{part.brand}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Rack</label>
            <p className="w-full px-4 py-3 border rounded-xl bg-gray-50">{part.rack}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Quantity</label>
            <p className="w-full px-4 py-3 border rounded-xl bg-gray-50">{part.Quentity}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Price (Rs.)</label>
            <p className="w-full px-4 py-3 border rounded-xl bg-gray-50">{part.price}</p>
          </div>
        </div>

        {/* Footer with barcode button + popup */}
        <div className="mt-8 border-t pt-6 flex justify-between items-center">
          <div>
            <span className="text-sm font-semibold text-gray-700">Barcode:</span>
            <button
              onClick={() => setShowBarcode(true)}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Show Barcode
            </button>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/SparePartsUpdate/${part._id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/SparePartsDisplay")}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
          >
            ← Back to Inventory
          </button>
        </div>
      </div>

      {/* Barcode Popup */}
      {showBarcode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative">
            <h3 className="text-xl font-bold mb-4">Barcode for {part.name}</h3>
            <svg ref={barcodeRef} />
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Download as PDF Sticker
              </button>
              <button
                onClick={() => setShowBarcode(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SparePartsViewForm;