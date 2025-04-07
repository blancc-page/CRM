"use client";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";

type Order = {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  customer: {
    name: string;
  };
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;
        if (!apiUrl) {
          throw new Error("Base URL is not defined");
        }

        const res = await fetch(`${apiUrl}/api/orders/${params.id}`, {
          cache: "no-store", // Ensuring no caching for fresh data
        });

        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  // If the order is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If no order is found
  if (!order) {
    return notFound();
  }

  // Function to trigger printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-container p-6 bg-white shadow-lg max-w-md mx-auto rounded-md">
      <div className="header text-center mb-6">
        {/* Optional: You can add a logo or company name here */}
        <h1 className="text-3xl font-bold text-gray-800">Your Company Name</h1>
        <p className="text-lg text-gray-600">Order Receipt</p>
        <hr className="my-4 border-gray-300" />
      </div>

      <div className="order-details mb-6">
        <p className="text-lg">
          <strong>Order ID:</strong> #{order.id}
        </p>
        <p className="text-lg">
          <strong>Customer:</strong> {order.customer.name}
        </p>
        <p className="text-lg">
          <strong>Status:</strong> {order.status}
        </p>
        <p className="text-lg">
          <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="total-amount text-xl font-semibold text-right mb-6">
        <p>
          <strong>Total Amount:</strong> Ksh {order.total_amount.toFixed(2)}
        </p>
      </div>

      {/* Optional: Add a footer with business information */}
      <div className="footer text-center text-sm text-gray-600 mt-8">
        <p>Your Company Name</p>
        <p>Address Line, City, Country</p>
        <p>Email: contact@yourcompany.com</p>
        <p>Phone: +123 456 7890</p>
        <hr className="my-4 border-gray-300" />
        <p>Thank you for your business!</p>
      </div>

      {/* Print button */}
      <div className="print-button text-center mt-8">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

