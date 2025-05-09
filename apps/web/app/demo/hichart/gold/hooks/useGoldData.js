import { useState, useEffect } from 'react';

// Mock data generator for gold prices
const generateMockData = (timeframe) => {
  const today = new Date();
  const data = [];
  let startDate;
  let interval;
  let basePrice = 1800; // Base price around $1800
  let volatility;

  switch (timeframe) {
    case 'MONTH':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      interval = 24 * 60 * 60 * 1000; // 1 day
      volatility = 0.01; // 1% daily volatility
      break;
    case 'YEAR':
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      interval = 7 * 24 * 60 * 60 * 1000; // 1 week
      volatility = 0.02; // 2% weekly volatility
      break;
    case 'TEN_YEARS':
      startDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
      interval = 30 * 24 * 60 * 60 * 1000; // 1 month
      volatility = 0.05; // 5% monthly volatility
      break;
    case 'HUNDRED_YEARS':
      startDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      interval = 365 * 24 * 60 * 60 * 1000; // 1 year
      volatility = 0.1; // 10% yearly volatility
      break;
    default:
      throw new Error('Invalid timeframe');
  }

  let currentDate = startDate;
  let currentPrice = basePrice;

  while (currentDate <= today) {
    // Add random walk with trend
    const change = currentPrice * volatility * (Math.random() - 0.48); // Slight upward bias
    currentPrice = Math.max(currentPrice + change, 100); // Ensure price doesn't go below 100
    
    data.push([
      currentDate.getTime(),
      Math.round(currentPrice * 100) / 100 // Round to 2 decimal places
    ]);
    
    currentDate = new Date(currentDate.getTime() + interval);
  }

  return data;
};

export const useGoldData = (timeframe) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Generate mock data
        const mockData = generateMockData(timeframe);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  return { data, loading, error };
}; 