import React, { useState } from "react";

function InsuranceDocumentCenter() {
  const [documents] = useState([
    {
      _id: "1",
      companyName: "Sri Lanka Insurance Corporation",
      policyType: "Third-Party Liability",
      policyNumber: "SLI-TP-10001",
      coverage: "Covers third-party property damage and bodily injuries",
      regulations: "Motor Vehicle Act, 2019; Insurance Regulatory Guidelines, 2021",
      agreementDetails: "Liability only. Does not cover own vehicle damages.",
      premium: "LKR 50,000 per year",
      effectiveDate: "2025-01-01",
      expiryDate: "2025-12-31",
    },
    {
      _id: "2",
      companyName: "Ceylinco General Insurance",
      policyType: "Third-Party Liability",
      policyNumber: "CEY-TP-20002",
      coverage: "Covers third-party property damage and bodily injuries",
      regulations: "Motor Vehicle Act, 2019; Insurance Regulatory Guidelines, 2021",
      agreementDetails: "Liability only. Does not cover own vehicle damages.",
      premium: "LKR 52,000 per year",
      effectiveDate: "2025-03-01",
      expiryDate: "2026-02-28",
    },
    {
      _id: "3",
      companyName: "Allianz Insurance Lanka",
      policyType: "Third-Party Liability",
      policyNumber: "ALL-TP-30003",
      coverage: "Covers third-party property damage and bodily injuries",
      regulations: "Motor Vehicle Act, 2019; Insurance Regulatory Guidelines, 2021",
      agreementDetails: "Liability only. Does not cover own vehicle damages.",
      premium: "LKR 55,000 per year",
      effectiveDate: "2025-06-01",
      expiryDate: "2026-05-31",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">
          Reference  & Knowledge Center
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Company</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Policy Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Policy Number</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Premium</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Effective Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Expiry Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Coverage</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Agreement Details</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700">Regulations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.companyName}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.policyType}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.policyNumber}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.premium}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.effectiveDate}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.expiryDate}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.coverage}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.agreementDetails}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{doc.regulations}</td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                  No insurance documents available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InsuranceDocumentCenter;
