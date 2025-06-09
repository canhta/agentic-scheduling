'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { UserResponseDto } from '@/lib/types';

interface UseUsersOptions {
  organizationId?: string;
  enabled?: boolean;
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, fetch all users since the API doesn't have organization-specific user filtering
      // In the future, this could be enhanced to filter by organization membership
      const data = await api.getUsers();
      setUsers(data.users);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchUsers();
    }
  }, [fetchUsers, options.enabled]);

  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch,
  };
}
