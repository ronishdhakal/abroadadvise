"use client";

import { useState, useEffect } from "react";
import { fetchConsultancyDashboard } from "@/utils/api";

const ConsultancyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await fetchConsultancyDashboard();
        // Assuming 'inquiries' is part of the returned data
        setInquiries(data.inquiries || []);
      } catch (err) {
        setError("Failed to load inquiries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) return <p>Loading inquiries...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Inquiries</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Entity Type</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-4 py-2">{inquiry.name}</td>
                <td className="px-4 py-2">{inquiry.email}</td>
                <td className="px-4 py-2">{inquiry.entity_type}</td>
                <td className="px-4 py-2">{inquiry.message}</td>
                <td className="px-4 py-2">{new Date(inquiry.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultancyInquiries;
