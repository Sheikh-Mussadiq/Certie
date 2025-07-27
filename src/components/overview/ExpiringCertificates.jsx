import { ShieldCheck } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    Urgent: "bg-red-100 text-red-700",
    "Due Soon": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const ExpiringCertificates = ({ documents }) => {
  const expiringCerts = documents
    .flatMap((prop) =>
      prop.folders.flatMap((folder) =>
        folder.documents.filter((doc) => doc.expiry_date)
      )
    )
    .map((doc) => {
      const daysUntilExpiry = differenceInDays(
        parseISO(doc.expiry_date),
        new Date()
      );
      let status = "";
      if (daysUntilExpiry <= 7) {
        status = "Urgent";
      } else if (daysUntilExpiry <= 30) {
        status = "Due Soon";
      }
      return { ...doc, status };
    })
    .filter((doc) => doc.status)
    .sort(
      (a, b) =>
        differenceInDays(parseISO(a.expiry_date), new Date()) -
        differenceInDays(parseISO(b.expiry_date), new Date())
    );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <ShieldCheck size={20} className="text-gray-600 mr-2" />
        <h3 className="font-semibold text-gray-700">Expiring Certificates</h3>
      </div>
      <div className="space-y-3">
        {expiringCerts.length > 0 ? (
          expiringCerts.slice(0, 3).map((cert, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="text-sm">{cert.name}</p>
              <StatusBadge status={cert.status} />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No expiring certificates.</p>
        )}
      </div>
    </div>
  );
};

export default ExpiringCertificates;
