import { useState, useEffect } from 'react';
import { dataAPI } from '../services/api';

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries
  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataAPI.getCountries();
      setCountries(response.data.data.countries);
    } catch (err) {
      setError('Failed to fetch countries');
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch states for a specific country
  const fetchStates = async (country) => {
    if (!country) {
      setStates([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await dataAPI.getStates(country);
      setStates(response.data.data.states);
    } catch (err) {
      setError('Failed to fetch states');
      console.error('Error fetching states:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    states,
    loading,
    error,
    fetchStates,
    fetchCountries,
  };
};
