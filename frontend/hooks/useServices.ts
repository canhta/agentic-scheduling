'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ServiceResponse } from '@/lib/types';

interface UseServicesOptions {
  organizationId?: string;
  enabled?: boolean;
}

export function useServices(options: UseServicesOptions = {}) {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    if (!options.organizationId) {
      setServices([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getOrganizationServices(options.organizationId);
      setServices(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  }, [options.organizationId]);

  useEffect(() => {
    if (options.enabled !== false && options.organizationId) {
      fetchServices();
    }
  }, [fetchServices, options.enabled, options.organizationId]);

  const refetch = useCallback(() => {
    if (options.organizationId) {
      fetchServices();
    }
  }, [fetchServices, options.organizationId]);

  return {
    services,
    loading,
    error,
    refetch,
  };
}
