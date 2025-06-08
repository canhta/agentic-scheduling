'use client';

import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { ServiceFormModal } from '@/components/organizations/ServiceFormModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { apiClient, ServiceResponse, Organization } from '@/lib/api-client';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceResponse | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load organizations and all services across organizations
      const [orgsData, servicesData] = await Promise.all([
        apiClient.getOrganizations(),
        getAllServices()
      ]);
      
      setOrganizations(orgsData);
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAllServices = async (): Promise<ServiceResponse[]> => {
    try {
      // First get all organizations
      const organizations = await apiClient.getOrganizations();
      
      // Then get services for each organization
      const allServices: ServiceResponse[] = [];
      for (const org of organizations) {
        try {
          const orgServices = await apiClient.getOrganizationServices(org.id);
          allServices.push(...orgServices);
        } catch (error) {
          // Continue if one organization fails
          console.error(`Failed to load services for organization ${org.id}:`, error);
        }
      }
      
      return allServices;
    } catch (error) {
      console.error('Failed to load all services:', error);
      return [];
    }
  };

  const handleCreateService = () => {
    setSelectedService(null);
    setShowServiceModal(true);
  };

  const handleEditService = (service: ServiceResponse) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleDeleteService = (service: ServiceResponse) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await apiClient.deleteOrganizationService(serviceToDelete.organizationId, serviceToDelete.id);
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  const handleServiceSubmit = async (serviceData: any) => {
    try {
      if (selectedService) {
        // Update existing service
        const updatedService = await apiClient.updateOrganizationService(
          selectedService.organizationId,
          selectedService.id,
          serviceData
        );
        setServices(services.map(s => 
          s.id === selectedService.id ? updatedService : s
        ));
      } else {
        // Create new service
        const newService = await apiClient.createOrganizationService(
          serviceData.organizationId,
          serviceData
        );
        setServices([...services, newService]);
      }
      setShowServiceModal(false);
      setSelectedService(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service');
    }
  };

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    return org?.name || 'Unknown Organization';
  };

  const getServiceTypeDisplay = (type: string) => {
    switch (type) {
      case 'CLASS': return 'Class';
      case 'APPOINTMENT': return 'Appointment';
      case 'WORKSHOP': return 'Workshop';
      case 'PERSONAL_TRAINING': return 'Personal Training';
      default: return type;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'Free';
    return `$${price}`;
  };

  const columns = [
    { 
      key: 'name' as keyof ServiceResponse, 
      title: 'Name',
      render: (value: unknown, service: ServiceResponse) => (
        <div>
          <div className="font-medium text-gray-900">{service.name}</div>
          {service.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
          )}
        </div>
      )
    },
    { 
      key: 'type' as keyof ServiceResponse, 
      title: 'Type',
      render: (value: unknown, service: ServiceResponse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          service.type === 'CLASS' ? 'bg-blue-100 text-blue-800' :
          service.type === 'APPOINTMENT' ? 'bg-green-100 text-green-800' :
          service.type === 'WORKSHOP' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {getServiceTypeDisplay(service.type)}
        </span>
      )
    },
    { 
      key: 'duration' as keyof ServiceResponse, 
      title: 'Duration',
      render: (value: unknown, service: ServiceResponse) => formatDuration(service.duration)
    },
    { 
      key: 'capacity' as keyof ServiceResponse, 
      title: 'Capacity',
      render: (value: unknown, service: ServiceResponse) => service.capacity || 'Unlimited'
    },
    { 
      key: 'price' as keyof ServiceResponse, 
      title: 'Price',
      render: (value: unknown, service: ServiceResponse) => formatPrice(service.price)
    },
    { 
      key: 'organizationId' as keyof ServiceResponse, 
      title: 'Organization',
      render: (value: unknown, service: ServiceResponse) => (
        <Link 
          href={`/admin/organizations/${service.organizationId}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {getOrganizationName(service.organizationId)}
        </Link>
      )
    },
    { 
      key: 'isActive' as keyof ServiceResponse, 
      title: 'Status',
      render: (value: unknown, service: ServiceResponse) => (
        <div className="flex flex-col space-y-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            service.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
          {service.bookable && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Bookable
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions' as keyof ServiceResponse,
      title: 'Actions',
      render: (value: unknown, service: ServiceResponse) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/organizations/${service.organizationId}`}
            className="text-blue-600 hover:text-blue-800"
            title="View Organization"
          >
            <HiEye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleEditService(service)}
            className="text-indigo-600 hover:text-indigo-800"
            title="Edit Service"
          >
            <HiPencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteService(service)}
            className="text-red-600 hover:text-red-800"
            title="Delete Service"
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
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all services across organizations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateService}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiPlus className="-ml-1 mr-2 h-5 w-5" />
            Add Service
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="bg-white shadow rounded-lg">
        <DataTable
          data={services}
          columns={columns}
          emptyMessage="No services found"
        />
      </div>

      {/* Service Form Modal */}
      {/* TODO: Fix ServiceFormModal interface to match usage pattern */}
      {showServiceModal && (
        <div>Service Modal - TODO: Fix interface</div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && serviceToDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Service"
          message={`Are you sure you want to delete "${serviceToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setServiceToDelete(null);
          }}
        />
      )}
    </div>
  );
}
