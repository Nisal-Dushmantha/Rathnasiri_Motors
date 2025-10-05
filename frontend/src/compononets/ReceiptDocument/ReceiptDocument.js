// src/components/ReceiptDocument.js
import React, { useRef, useEffect } from "react";

function ReceiptDocument({ data, onReady }) {
  const invoiceRef = useRef();

  useEffect(() => {
    if (invoiceRef.current && onReady) {
      onReady(invoiceRef.current); // parent can generate PDF from this
    }
  }, [invoiceRef, onReady]);

  if (!data) return null;

  const { customerName, vehicleNumber, amount, serviceCharge, total, method, billId } = data;
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  return (
    <div
      ref={invoiceRef}
      style={{
        width: "100%",
        maxWidth: "595pt", // A4 width
        margin: "0 auto",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(to right, #2563EB, #1E40AF)",
          color: "#fff",
          padding: "20px 30px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>RATHNASIRI MOTORS</h1>
            <p style={{ fontSize: 16, color: "#BFDBFE" }}>Insurance Registration Center</p>
            <div style={{ marginTop: 8, fontSize: 12, color: "#BFDBFE" }}>
              <p>📍 Polgahawela Road,Imbulgasdeniya,Kegalle</p>
              <p>📞 037 2242101/0776575477/0761617789 | 📧 yamahakegalle@gmail.com </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: 10,
                backdropFilter: "blur(4px)",
              }}
            >
              <p style={{ fontSize: 10, color: "#BFDBFE", fontWeight: 500 }}>INVOICE DATE</p>
              <p style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>{dateStr}</p>
              <p style={{ fontSize: 10, color: "#BFDBFE" }}>{timeStr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Details */}
      <div style={{ padding: "20px 30px" }}>
        {/* Invoice Number */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            padding: 10,
            backgroundColor: "#F9FAFB",
            borderRadius: 8,
          }}
        >
          <div>
            <p style={{ fontSize: 10, color: "#6B7280", fontWeight: 500 }}>INVOICE #</p>
            <p style={{ fontSize: 14, fontWeight: "bold", color: "#111827" }}>{billId || "N/A"}</p>
          </div>
          <div>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#DCFCE7",
                color: "#166534",
                padding: "4px 8px",
                borderRadius: 9999,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              COMPLETED
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <Section title="Customer Details">
          <DetailRow label="Name" value={customerName} index={0} />
          <DetailRow label="Vehicle No" value={vehicleNumber} index={1} />
        </Section>

        {/* Payment Information */}
        <Section title="Payment Details">
          <DetailRow label="Payment Method" value={method} index={0} />
          <DetailRow label="Base Amount" value={`Rs. ${amount.toFixed(2)}`} index={1} />
          <DetailRow label="Service Charge" value={`Rs. ${serviceCharge.toFixed(2)}`} index={2} />
          <DetailRow label="TOTAL" value={`Rs. ${total.toFixed(2)}`} index={3} highlight />
        </Section>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ borderBottom: "2px solid #9CA3AF", width: 150, height: 16 }}></div>
            <p style={{ marginTop: 4, fontSize: 12, fontWeight: "bold", color: "#374151" }}>Manager - Rathnasiri Motors</p>
            <p style={{ fontSize: 10, color: "#6B7280" }}>Authorized Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 30, borderTop: "2px solid #E5E7EB", paddingTop: 20 }}>
          <p style={{ fontSize: 14, fontWeight: "bold", color: "#2563EB" }}>Thank you for choosing Rathnasiri Motors!</p>
          <p style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>
            We appreciate your trust and business.
          </p>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Section & DetailRow */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{ fontSize: 14, fontWeight: "bold", color: "#1D4ED8", borderBottom: "2px solid #BFDBFE", marginBottom: 8, paddingBottom: 4 }}>
      {title}
    </h2>
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>{children}</div>
  </div>
);

const DetailRow = ({ label, value, index, highlight }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      padding: 8,
      fontSize: 12,
      backgroundColor: highlight ? "#DCFCE7" : index % 2 === 0 ? "#fff" : "#F9FAFB",
      fontWeight: highlight ? "bold" : "normal",
    }}
  >
    <div style={{ color: "#374151" }}>{label}</div>
    <div style={{ color: "#111827" }}>{value || "N/A"}</div>
  </div>
);

export default ReceiptDocument;
