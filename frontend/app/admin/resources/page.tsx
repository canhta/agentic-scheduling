'use client';

import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import Link from 'next/link';
import { api, ResourceResponse, Organization } from '@/lib/api';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceResponse[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceResponse | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<ResourceResponse | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load organizations and all resources across organizations
      const [orgsData, resourcesData] = await Promise.all([
        api.getOrganizations(),
        // We'll need to load resources from all organizations
        getAllResources()
      ]);

      setOrganizations(orgsData);
      setResources(resourcesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAllResources = async (): Promise<ResourceResponse[]> => {
    try {
      // First get all organizations
      const organizations = await api.getOrganizations();

      // Then get resources for each organization
      const allResources: ResourceResponse[] = [];
      for (const org of organizations) {
        try {
          const orgResources = await api.getOrganizationResources(org.id);
          allResources.push(...orgResources);
        } catch (error) {
          // Continue if one organization fails
          console.error(`Failed to load resources for organization ${org.id}:`, error);
        }
      }

      return allResources;
    } catch (error) {
      console.error('Failed to load all resources:', error);
      return [];
    }
  };

  const handleCreateResource = () => {
    setSelectedResource(null);
    setShowResourceModal(true);
  };

  const handleEditResource = (resource: ResourceResponse) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const handleDeleteResource = (resource: ResourceResponse) => {
    setResourceToDelete(resource);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await api.deleteOrganizationResource(resourceToDelete.organizationId, resourceToDelete.id);
      setResources(resources.filter(r => r.id !== resourceToDelete.id));
      setShowDeleteModal(false);
      setResourceToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
    }
  };

  const handleResourceSubmit = async (resourceData: any) => {
    try {
      if (selectedResource) {
        // Update existing resource
        const updatedResource = await api.updateOrganizationResource(
          selectedResource.organizationId,
          selectedResource.id,
          resourceData
        );
        setResources(resources.map(r =>
          r.id === selectedResource.id ? updatedResource : r
        ));
      } else {
        // Create new resource
        const newResource = await api.createOrganizationResource(
          resourceData.organizationId,
          resourceData
        );
        setResources([...resources, newResource]);
      }
      setShowResourceModal(false);
      setSelectedResource(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resource');
    }
  };

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    return org?.name || 'Unknown Organization';
  };

  const getResourceTypeDisplay = (type: string) => {
    return type === 'ROOM' ? 'Room' : 'Equipment';
  };

  const columns = [
    {
      key: 'name' as keyof ResourceResponse,
      title: 'Name',
      render: (value: unknown, resource: ResourceResponse) => (
        <div>
          <div className="font-medium text-gray-900">{resource.name}</div>
          {resource.description && (
            <div className="text-sm text-gray-500">{resource.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'type' as keyof ResourceResponse,
      title: 'Type',
      render: (value: unknown, resource: ResourceResponse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.type === 'ROOM'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
          }`}>
          {getResourceTypeDisplay(resource.type)}
        </span>
      )
    },
    {
      key: 'capacity' as keyof ResourceResponse,
      title: 'Capacity',
      render: (value: unknown, resource: ResourceResponse) => resource.capacity || 'N/A'
    },
    {
      key: 'organizationId' as keyof ResourceResponse,
      title: 'Organization',
      render: (value: unknown, resource: ResourceResponse) => (
        <Link
          href={`/admin/organizations/${resource.organizationId}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {getOrganizationName(resource.organizationId)}
        </Link>
      )
    },
    {
      key: 'isActive' as keyof ResourceResponse,
      title: 'Status',
      render: (value: unknown, resource: ResourceResponse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }`}>
          {resource.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions' as keyof ResourceResponse,
      title: 'Actions',
      render: (value: unknown, resource: ResourceResponse) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/organizations/${resource.organizationId}`}
            className="text-blue-600 hover:text-blue-800"
            title="View Organization"
          >
            <HiEye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleEditResource(resource)}
            className="text-indigo-600 hover:text-indigo-800"
            title="Edit Resource"
          >
            <HiPencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteResource(resource)}
            className="text-red-600 hover:text-red-800"
            title="Delete Resource"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all resources across organizations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateResource}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Resource
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="bg-white shadow rounded-lg">
        <DataTable
          data={resources}
          columns={columns}
          emptyMessage="No resources found"
        />
      </div>

      {/* Resource Form Modal */}
      {/* TODO: Fix ResourceFormModal interface to match usage pattern */}
      {showResourceModal && (
        <div>Resource Modal - TODO: Fix interface</div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && resourceToDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Resource"
          message={`Are you sure you want to delete "${resourceToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setResourceToDelete(null);
          }}
        />
      )}
    </div>
  );
}
