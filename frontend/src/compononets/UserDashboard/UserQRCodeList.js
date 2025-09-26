import React from "react";
import { QRCode } from "qrcode.react";

// Example user list
const users = [
  { id: "U001", name: "Alice", membershipType: "Gold", status: "Active" },
  { id: "U002", name: "Bob", membershipType: "Silver", status: "Active" },
  { id: "U003", name: "Charlie", membershipType: "Bronze", status: "Inactive" }
];

const UserQRCodeList = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "center", marginTop: 32 }}>
    {users.map(user => {
      const qrValue = JSON.stringify(user);
      return (
        <div key={user.id} style={{ border: "1px solid #1976d2", borderRadius: 12, padding: 20, background: "#f9f9f9", textAlign: "center", minWidth: 220 }}>
          <h4 style={{ color: "#1976d2" }}>{user.name}</h4>
          <QRCode value={qrValue} size={100} style={{ margin: "12px 0" }} />
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>Type:</strong> {user.membershipType}</div>
          <div><strong>Status:</strong> {user.status}</div>
        </div>
      );
    })}
  </div>
);

export default UserQRCodeList;
