import { useState, useEffect } from 'react';
import axios from 'axios';
export const useApi = <T>(url: string, dependencies: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(url);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

export const useApiMutation = <T, K>(url: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data?: K): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        method,
        url,
        data,
      });
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};