import { useState, useEffect, useCallback } from 'react';
import { dataAPI } from '../services/api';

export const useCountries = (autoCountry = null) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = useCallback(async () => {
    setCountriesLoading(true);
    setError(null);
    try {
      const response = await dataAPI.getCountries();
      // defensive accessor depending on API shape
      const list = response?.data?.data?.countries ?? response?.data ?? [];
      setCountries(list);
    } catch (err) {
      setError('Failed to fetch countries');
      console.error('Error fetching countries:', err);
    } finally {
      setCountriesLoading(false);
    }
  }, []);

  const fetchStates = useCallback(async (country) => {
    if (!country) {
      setStates([]);
      return;
    }
    setStatesLoading(true);
    setError(null);
    try {
      const response = await dataAPI.getStates(country);
      const list = response?.data?.data?.states ?? response?.data ?? [];
      setStates(list);
    } catch (err) {
      setError('Failed to fetch states');
      console.error('Error fetching states:', err);
    } finally {
      setStatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // optional auto-fetch states when autoCountry provided/changes
  useEffect(() => {
    if (autoCountry) fetchStates(autoCountry);
  }, [autoCountry, fetchStates]);

  return {
    countries,
    states,
    countriesLoading,
    statesLoading,
    error,
    fetchCountries,
    fetchStates,
  };
};
