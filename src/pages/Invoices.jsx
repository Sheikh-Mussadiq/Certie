import { useState, useEffect } from "react";
import { getInvoicesForUser } from "../services/invoiceServices";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userInvoices = await getInvoicesForUser();
        setInvoices(userInvoices);
        setError(null);
      } catch (err) {
        setError("Failed to fetch invoices. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Invoices</h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && invoices.length === 0 && (
        <p>You don't have any invoices yet.</p>
      )}
      {!loading && !error && invoices.length > 0 && (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    Invoice #{invoice.stripe_invoice_id.substring(0, 8)}
                  </h2>
                  <p className="text-gray-500">
                    Due Date: {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      invoice.status === "paid"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </p>
                  <a
                    href={invoice.hosted_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Invoice
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
