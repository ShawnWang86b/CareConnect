import { useState, useEffect, useCallback } from "react";

// General fetch function to make API requests
export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    console.log('Fetch request to:', url, 'with options:', options);  // Log the request URL and options
    
    const response = await fetch(url, options);
    console.log('Raw response status:', response.status);  // Log the raw response status
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);  // Throw an error if response is not ok
    }
    
    const data = await response.json();
    console.log('Response data:', data);  // Log the response data
    
    return data;
  } catch (error) {
    console.error("Fetch error:", {
      message: error.message,
      stack: error.stack,
      url,
      options
    });
    throw error;
  }
};

// Custom hook to fetch data and manage loading/error states
export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data and update state
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Fetch data on component mount or when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
