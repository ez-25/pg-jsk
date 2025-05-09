import { useState, useEffect } from "react";

// Simple CSV parser for Date,Price format
function parseGoldCsv(csv) {
  const lines = csv.trim().split("\n");
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    // skip header
    const [dateStr, priceStr] = lines[i].split(",");
    const date = new Date(dateStr);
    if (!isNaN(date)) {
      result.push([date.getTime(), parseFloat(priceStr)]);
    }
  }
  return result.reverse(); // so oldest is first
}

export function useGoldCsvData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCsv() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/data/gold/gold_1year.csv");
        if (!res.ok) throw new Error("Failed to fetch CSV");
        const text = await res.text();
        setData(parseGoldCsv(text));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCsv();
  }, []);

  return { data, loading, error };
}
