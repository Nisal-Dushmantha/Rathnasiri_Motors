
import React from "react";
import UserQRCodeList from "./UserQRCodeList";

// For demonstration, show a list of QR codes for users
const MembershipCard = () => {
  return (
    <div>
      <h2 style={{ color: "#1976d2", textAlign: "center", marginTop: 24 }}>All User Membership QR Codes</h2>
      <UserQRCodeList />
    </div>
  );
};

export default MembershipCard;
