'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, TabItem, Tabs } from 'flowbite-react';
import { HiArrowLeft, HiLocationMarker, HiViewBoards, HiCog, HiPlus } from 'react-icons/hi';
import {
  api,
  Organization,
  LocationResponse,
  ResourceResponse,
  ServiceResponse,
  OrganizationSettingsResponseDto,
  CreateLocationDto,
  UpdateLocationDto,
  CreateResourceDto,
  UpdateResourceDto,
  CreateServiceDto,
  UpdateServiceDto,
  UpdateOrganizationSettingsDto
} from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { DataTable, StatusBadge, TableColumn } from '@/components/ui/DataTable';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { ResourceFormModal } from '@/components/organizations/ResourceFormModal';
import { ServiceFormModal } from '@/components/organizations/ServiceFormModal';
import { OrganizationSettingsModal } from '@/components/organizations/OrganizationSettingsModal';

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.id as string;

  // State
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [resources, setResources] = useState<ResourceResponse[]>([]);
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [settings, setSettings] = useState<OrganizationSettingsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('locations');

  // Modal states
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected items for edit/delete
  const [selectedLocation, setSelectedLocation] = useState<LocationResponse | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceResponse | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ type: string; item: any } | null>(null);

  // Form data
  const [locationFormData, setLocationFormData] = useState<CreateLocationDto | UpdateLocationDto>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    isPrimary: false
  });

  const [resourceFormData, setResourceFormData] = useState<CreateResourceDto | UpdateResourceDto>({
    name: '',
    type: 'ROOM',
    isBookable: true
  });

  const [serviceFormData, setServiceFormData] = useState<CreateServiceDto | UpdateServiceDto>({
    name: '',
    type: 'CLASS',
    duration: 60,
    bookable: true,
    requiresApproval: false,
    allowWaitlist: true
  });

  const [settingsFormData, setSettingsFormData] = useState<UpdateOrganizationSettingsDto>({});


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [orgData, locationsData, resourcesData, servicesData, settingsData] = await Promise.all([
        api.getOrganization(organizationId),
        api.getOrganizationLocations(organizationId).catch(() => []),
        api.getOrganizationResources(organizationId).catch(() => []),
        api.getOrganizationServices(organizationId).catch(() => []),
        api.getOrganizationSettings(organizationId).catch(() => null)
      ]);

      setOrganization(orgData);
      setLocations(locationsData);
      setResources(resourcesData);
      setServices(servicesData);
      setSettings(settingsData);

      if (settingsData) {
        setSettingsFormData({
          bookingWindowDays: settingsData.bookingWindowDays,
          cancellationWindowHours: settingsData.cancellationWindowHours,
          lateCancelPenalty: settingsData.lateCancelPenalty,
          noShowPenalty: settingsData.noShowPenalty,
          waitlistEnabled: settingsData.waitlistEnabled,
          maxWaitlistSize: settingsData.maxWaitlistSize,
          defaultClassDuration: settingsData.defaultClassDuration,
          allowRecurringBookings: settingsData.allowRecurringBookings,
          maxBookingsPerMember: settingsData.maxBookingsPerMember,
          sendConfirmationEmails: settingsData.sendConfirmationEmails,
          sendReminderEmails: settingsData.sendReminderEmails,
          reminderHours: settingsData.reminderHours,
          primaryColor: settingsData.primaryColor,
          secondaryColor: settingsData.secondaryColor,
          logoUrl: settingsData.logoUrl,
          faviconUrl: settingsData.faviconUrl,
          customDomain: settingsData.customDomain,
          requireMembershipForBooking: settingsData.requireMembershipForBooking,
          allowGuestBookings: settingsData.allowGuestBookings,
          minimumAdvanceBooking: settingsData.minimumAdvanceBooking,
          maximumAdvanceBooking: settingsData.maximumAdvanceBooking,
          businessHours: settingsData.businessHours
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization data');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);


  useEffect(() => {
    if (organizationId) {
      fetchData();
    }
  }, [fetchData, organizationId]);

  // Location handlers
  const handleCreateLocation = () => {
    setLocationFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      isPrimary: false
    });
    setSelectedLocation(null);
    setShowLocationModal(true);
  };

  const handleEditLocation = (location: LocationResponse) => {
    setLocationFormData({
      name: location.name,
      description: location.description,
      address: location.address,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: location.country,
      phone: location.phone,
      email: location.email,
      isPrimary: location.isPrimary,
      isActive: location.isActive
    });
    setSelectedLocation(location);
    setShowLocationModal(true);
  };

  const handleSubmitLocation = async (data: CreateLocationDto | UpdateLocationDto) => {
    try {
      if (selectedLocation) {
        await api.updateOrganizationLocation(organizationId, selectedLocation.id, data as UpdateLocationDto);
      } else {
        await api.createOrganizationLocation(organizationId, data as CreateLocationDto);
      }
      setShowLocationModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location');
    }
  };

  // Resource handlers
  const handleCreateResource = () => {
    setResourceFormData({
      name: '',
      type: 'ROOM',
      isBookable: true
    });
    setSelectedResource(null);
    setShowResourceModal(true);
  };

  const handleEditResource = (resource: ResourceResponse) => {
    setResourceFormData({
      name: resource.name,
      type: resource.type,
      description: resource.description,
      capacity: resource.capacity,
      locationId: resource.locationId,
      isBookable: resource.isBookable,
      isActive: resource.isActive
    });
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const handleSubmitResource = async (data: CreateResourceDto | UpdateResourceDto) => {
    try {
      if (selectedResource) {
        await api.updateOrganizationResource(organizationId, selectedResource.id, data as UpdateResourceDto);
      } else {
        await api.createOrganizationResource(organizationId, data as CreateResourceDto);
      }
      setShowResourceModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resource');
    }
  };

  // Service handlers
  const handleCreateService = () => {
    setServiceFormData({
      name: '',
      type: 'CLASS',
      duration: 60,
      bookable: true,
      requiresApproval: false,
      allowWaitlist: true
    });
    setSelectedService(null);
    setShowServiceModal(true);
  };

  const handleEditService = (service: ServiceResponse) => {
    setServiceFormData({
      name: service.name,
      description: service.description,
      type: service.type,
      duration: service.duration,
      capacity: service.capacity,
      price: service.price,
      bookable: service.bookable,
      requiresApproval: service.requiresApproval,
      allowWaitlist: service.allowWaitlist,
      locationId: service.locationId,
      primaryInstructorId: service.primaryInstructorId,
      assistantInstructorId: service.assistantInstructorId,
      resourceIds: service.resourceIds,
      color: service.color,
      isActive: service.isActive
    });
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleSubmitService = async (data: CreateServiceDto | UpdateServiceDto) => {
    try {
      if (selectedService) {
        await api.updateOrganizationService(organizationId, selectedService.id, data as UpdateServiceDto);
      } else {
        await api.createOrganizationService(organizationId, data as CreateServiceDto);
      }
      setShowServiceModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service');
    }
  };

  // Settings handlers
  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSubmitSettings = async (data: UpdateOrganizationSettingsDto) => {
    try {
      await api.updateOrganizationSettings(organizationId, data);
      setShowSettingsModal(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  // Delete handlers
  const handleDelete = (type: string, item: any) => {
    setDeleteItem({ type, item });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    try {
      switch (deleteItem.type) {
        case 'location':
          await api.deleteOrganizationLocation(organizationId, deleteItem.item.id);
          break;
        case 'resource':
          await api.deleteOrganizationResource(organizationId, deleteItem.item.id);
          break;
        case 'service':
          await api.deleteOrganizationService(organizationId, deleteItem.item.id);
          break;
      }
      setShowDeleteModal(false);
      setDeleteItem(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${deleteItem.type}`);
    }
  };

  // Table columns
  const locationColumns: TableColumn<LocationResponse>[] = [
    { key: 'name', title: 'Name' },
    { key: 'address', title: 'Address' },
    { key: 'city', title: 'City' },
    { key: 'state', title: 'State' },
    {
      key: 'isPrimary',
      title: 'Primary',
      render: (value) => value ? <StatusBadge status={true} activeText="Primary" /> : null
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => <StatusBadge status={!!value} activeText='Active' inactiveText='Inactive' />
    }
  ];

  const resourceColumns: TableColumn<ResourceResponse>[] = [
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type' },
    { key: 'capacity', title: 'Capacity' },
    {
      key: 'isBookable',
      title: 'Bookable',
      render: (value) => <StatusBadge status={!!value} activeText='Yes' inactiveText='No' />
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => <StatusBadge status={!!value} activeText='Active' inactiveText='Inactive' />
    }
  ];

  const serviceColumns: TableColumn<ServiceResponse>[] = [
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type' },
    { key: 'duration', title: 'Duration (min)' },
    { key: 'capacity', title: 'Capacity' },
    { key: 'price', title: 'Price', render: (value) => value ? `$${value}` : 'Free' },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => <StatusBadge status={!!value} activeText='Active' inactiveText='Inactive' />
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!organization) {
    return <ErrorAlert message="Organization not found" />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          color="gray"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <HiArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
            <p className="text-gray-600">{organization.description}</p>
          </div>
          <Button onClick={handleOpenSettings}>
            <HiCog className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs
        aria-label="Organization tabs"
        onActiveTabChange={(tab) => setActiveTab(['locations', 'resources', 'services'][tab])}
      >
        <TabItem active title="Locations" icon={HiLocationMarker}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Locations</h2>
              <Button onClick={handleCreateLocation}>
                <HiPlus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </div>
            <DataTable
              data={locations}
              columns={locationColumns}
              onEdit={handleEditLocation}
              onDelete={(location) => handleDelete('location', location)}
            />
          </div>
        </TabItem>

        <TabItem title="Resources" icon={HiViewBoards}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Resources</h2>
              <Button onClick={handleCreateResource}>
                <HiPlus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>
            <DataTable
              data={resources}
              columns={resourceColumns}
              onEdit={handleEditResource}
              onDelete={(resource) => handleDelete('resource', resource)}
            />
          </div>
        </TabItem>

        <TabItem title="Services" icon={HiViewBoards}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Services</h2>
              <Button onClick={handleCreateService}>
                <HiPlus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
            <DataTable
              data={services}
              columns={serviceColumns}
              onEdit={handleEditService}
              onDelete={(service) => handleDelete('service', service)}
            />
          </div>
        </TabItem>
      </Tabs>

      <ResourceFormModal
        isOpen={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        onSubmit={handleSubmitResource}
        title={selectedResource ? 'Edit Resource' : 'Create Resource'}
        formData={resourceFormData}
        setFormData={setResourceFormData}
        resource={selectedResource}
        organizationLocations={locations.map(l => ({ id: l.id, name: l.name }))}
      />

      <ServiceFormModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSubmit={handleSubmitService}
        title={selectedService ? 'Edit Service' : 'Create Service'}
        formData={serviceFormData}
        setFormData={setServiceFormData}
        service={selectedService}
        organizationLocations={locations.map(l => ({ id: l.id, name: l.name }))}
        organizationResources={resources.map(r => ({ id: r.id, name: r.name }))}
      />

      <OrganizationSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSubmit={handleSubmitSettings}
        formData={settingsFormData}
        setFormData={setSettingsFormData}
        settings={settings}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteItem?.type}`}
        message={`Are you sure you want to delete this ${deleteItem?.type}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
