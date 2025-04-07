"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

type Order = {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  customer: {
    name: string;
  };
  items: { name: string; price: number; quantity: number; total: number }[]; // Example for goods/services
  credits: number;
  discounts: number;
  taxes: number;
  payment_method: string;
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to fetch the order
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

  // Function to handle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to trigger printing the receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="order-details">
        <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
        <p><strong>Customer:</strong> {order.customer.name}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <button
          onClick={toggleModal}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View Receipt
        </button>
      </div>

      {/* Modal for the receipt */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h2 className="text-3xl font-bold text-center mb-4">Receipt</h2>
            <div className="order-items mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="border-b py-2 px-4">Item</th>
                    <th className="border-b py-2 px-4">Price</th>
                    <th className="border-b py-2 px-4">Quantity</th>
                    <th className="border-b py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.name}>
                      <td className="border-b py-2 px-4">{item.name}</td>
                      <td className="border-b py-2 px-4">Ksh {item.price.toFixed(2)}</td>
                      <td className="border-b py-2 px-4">{item.quantity}</td>
                      <td className="border-b py-2 px-4">Ksh {item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pricing-summary mb-6">
              <p><strong>Credits:</strong> Ksh {order.credits.toFixed(2)}</p>
              <p><strong>Discounts:</strong> Ksh {order.discounts.toFixed(2)}</p>
              <p><strong>Taxes:</strong> Ksh {order.taxes.toFixed(2)}</p>
              <p><strong>Total Amount Paid:</strong> Ksh {order.total_amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {order.payment_method}</p>
            </div>

            <div className="text-center">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
              >
                Print Receipt
              </button>
              <button
                onClick={toggleModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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
