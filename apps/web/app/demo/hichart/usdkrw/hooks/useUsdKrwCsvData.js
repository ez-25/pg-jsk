import { useState, useEffect } from 'react';

function parseUsdKrwCsv(csv, type) {
  const lines = csv.trim().split('\n');
  const result = [];
  for (let i = 1; i < lines.length; i++) { // skip header
    const [dateStr, valueStr] = lines[i].split(',');
    let x;
    if (type === '1Y') {
      x = new Date(dateStr).getTime();
    } else {
      // For 10Y and 100Y, x is just the year (as Date Jan 1)
      x = new Date(dateStr + '-01-01').getTime();
    }
    result.push([x, parseFloat(valueStr)]);
  }
  return result;
}

export function useUsdKrwCsvData(timeframe) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let file, type;
    if (timeframe === '1Y') {
      file = '/data/usd_krw_1year.csv';
      type = '1Y';
    } else if (timeframe === '10Y') {
      file = '/data/usd_krw_10year.csv';
      type = '10Y';
    } else if (timeframe === '100Y') {
      file = '/data/usd_krw_100year.csv';
      type = '100Y';
    } else {
      setError('Invalid timeframe');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch CSV');
        return res.text();
      })
      .then(text => setData(parseUsdKrwCsv(text, type)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [timeframe]);

  return { data, loading, error };
} 