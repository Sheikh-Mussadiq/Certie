import { useState, useEffect } from "react";
import { getPropertiesBasic } from "../services/propertiesServices";
import { getAllBookings } from "../services/bookingServices";
import { getAllDocumentsGroupedByProperty } from "../services/documentServices";
import { getLogbooksWithEntries } from "../services/logbookservices";

export const useOverviewData = () => {
  const [data, setData] = useState({
    properties: [],
    bookings: [],
    documents: [],
    logbooks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [properties, bookings, documents, logbooks] = await Promise.all([
          getPropertiesBasic(),
          getAllBookings(),
          getAllDocumentsGroupedByProperty(),
          getLogbooksWithEntries(),
        ]);
        setData({ properties, bookings, documents, logbooks });
      } catch (err) {
        setError(err);
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...data, loading, error };
};
