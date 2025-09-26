import React from "react";
import { QRCode } from "qrcode.react";

const UserQRCodeCard = ({ userId }) => (
  <div style={{ textAlign: "center", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
    <h3>Your Digital Membership Card</h3>
    <QRCode value={userId} size={180} />
    <p>User ID: {userId}</p>
  </div>
);

export default UserQRCodeCard;
