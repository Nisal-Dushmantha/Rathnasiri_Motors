import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const CustomerQRCodeModal = ({ customer, onClose }) => {
  if (!customer) return null;
  const fullName = customer.customerName || "";
  const [lastName, ...rest] = fullName.split(" ");
  const firstName = rest.join(" ");
  const phone = customer.contactNumber || "";
  const email = customer.email || "";
  const note = `Customer ID: ${customer.customerId || ""}`;

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${lastName};${firstName};;;`,
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    `NOTE:${note}`,
    "END:VCARD",
  ].join("\n");

  const qrValue = vcard;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 2px 16px #333", textAlign: "center", minWidth: 320 }}>
        <h2 style={{ color: "#1976d2", marginBottom: 16 }}>Customer QR Code</h2>
  <QRCodeCanvas value={qrValue} size={180} />
        <div style={{ marginTop: 16 }}>
          <div><strong>ID:</strong> {customer.customerId}</div>
          <div><strong>Name:</strong> {customer.customerName}</div>
          <div><strong>Contact:</strong> {customer.contactNumber}</div>
          <div><strong>Email:</strong> {customer.email}</div>
        </div>
        <button onClick={onClose} style={{ marginTop: 24, padding: "8px 24px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
};

export default CustomerQRCodeModal;
