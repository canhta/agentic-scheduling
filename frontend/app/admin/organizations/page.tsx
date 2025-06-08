'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'flowbite-react';
import { HiPlus, HiEye } from 'react-icons/hi';
import { api, Organization, CreateOrganizationDto } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { DataTable, StatusBadge, TableColumn } from '@/components/ui/DataTable';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { OrganizationFormModal } from '@/components/organizations/OrganizationFormModal';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<CreateOrganizationDto>({
    name: '',
    slug: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    timezone: 'UTC',
    currency: 'USD',
    businessType: 'gym',
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      website: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      timezone: 'UTC',
      currency: 'USD',
      businessType: 'gym',
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setFormData({
      name: organization.name,
      slug: organization.slug,
      description: organization.description || '',
      website: organization.website || '',
      phone: organization.phone || '',
      email: organization.email || '',
      address: organization.address || '',
      city: organization.city || '',
      state: organization.state || '',
      zipCode: organization.zipCode || '',
      country: organization.country,
      timezone: organization.timezone,
      currency: organization.currency,
      businessType: organization.businessType,
    });
    setShowEditModal(true);
  };

  const handleDelete = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowDeleteModal(true);
  };

  const submitCreate = async () => {
    try {
      await api.createOrganization(formData);
      setShowCreateModal(false);
      resetForm();
      await fetchOrganizations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    }
  };

  const submitEdit = async () => {
    if (!selectedOrganization) return;
    
    try {
      await api.updateOrganization(selectedOrganization.id, formData);
      setShowEditModal(false);
      setSelectedOrganization(null);
      resetForm();
      await fetchOrganizations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
    }
  };

  const confirmDelete = async () => {
    if (!selectedOrganization) return;
    
    try {
      await api.deleteOrganization(selectedOrganization.id);
      setShowDeleteModal(false);
      setSelectedOrganization(null);
      await fetchOrganizations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization');
    }
  };

  // Define table columns
  const columns: TableColumn<Organization>[] = [
    {
      key: 'name',
      title: 'Name',
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.name}</div>
          {record.email && (
            <div className="text-sm text-gray-500">{record.email}</div>
          )}
        </div>
      )
    },
    {
      key: 'slug',
      title: 'Slug',
      render: (value) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{String(value)}</code>
      )
    },
    {
      key: 'businessType',
      title: 'Business Type',
      render: (value) => (
        <span className="text-sm text-gray-500 capitalize">{String(value).replace('_', ' ')}</span>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => <StatusBadge status={Boolean(value)} />
    },
    {
      key: 'location',
      title: 'Location',
      render: (_, record) => (
        <span className="text-sm text-gray-500">
          {record.city && record.state ? `${record.city}, ${record.state}` : record.country}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Link 
          href={`/admin/organizations/${record.id}`}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <HiEye className="w-4 h-4 mr-1" />
          View Details
        </Link>
      )
    }
  ];

  if (loading) {
    return <LoadingSpinner text="Loading organizations..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your organizations and their settings</p>
        </div>
        <Button onClick={handleCreate}>
          <HiPlus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} />
      )}

      <DataTable
        columns={columns}
        data={organizations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No organizations found. Create your first organization to get started."
      />

      {/* Create/Edit Modal */}
      <OrganizationFormModal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedOrganization(null);
          resetForm();
        }}
        onSubmit={showCreateModal ? submitCreate : submitEdit}
        title={showCreateModal ? 'Create New Organization' : 'Edit Organization'}
        formData={formData}
        setFormData={setFormData}
        organization={selectedOrganization}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedOrganization(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Organization"
        message={`Are you sure you want to delete "${selectedOrganization?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
}
