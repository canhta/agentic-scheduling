'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import Link from 'next/link';
import { apiClient, LocationResponse, Organization, CreateLocationDto, UpdateLocationDto } from '@/lib/api-client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { DataTable, StatusBadge } from '@/components/ui/DataTable';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { LocationFormModal } from '@/components/organizations/LocationFormModal';

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResponse | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<LocationResponse | null>(null);
  const [locationFormData, setLocationFormData] = useState<CreateLocationDto | UpdateLocationDto>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    isPrimary: false
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load organizations and all locations across organizations
      const [orgsData, locationsData] = await Promise.all([
        apiClient.getOrganizations(),
        getAllLocations()
      ]);
      
      setOrganizations(orgsData);
      setLocations(locationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getAllLocations = async (): Promise<LocationResponse[]> => {
    try {
      // First get all organizations
      const organizations = await apiClient.getOrganizations();
      
      // Then get locations for each organization
      const allLocations: LocationResponse[] = [];
      for (const org of organizations) {
        try {
          const orgLocations = await apiClient.getOrganizationLocations(org.id);
          allLocations.push(...orgLocations);
        } catch (error) {
          // Continue if one organization fails
          console.error(`Failed to load locations for organization ${org.id}:`, error);
        }
      }
      
      return allLocations;
    } catch (error) {
      console.error('Failed to load all locations:', error);
      return [];
    }
  };

  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setLocationFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      isPrimary: false
    });
    setShowLocationModal(true);
  };

  const handleEditLocation = (location: LocationResponse) => {
    setSelectedLocation(location);
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
    setShowLocationModal(true);
  };

  const handleDeleteLocation = (location: LocationResponse) => {
    setLocationToDelete(location);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      await apiClient.deleteOrganizationLocation(locationToDelete.organizationId, locationToDelete.id);
      setLocations(locations.filter(l => l.id !== locationToDelete.id));
      setShowDeleteModal(false);
      setLocationToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location');
    }
  };

  const handleLocationSubmit = async (locationData: CreateLocationDto | UpdateLocationDto) => {
    try {
      if (selectedLocation) {
        // Update existing location
        const updatedLocation = await apiClient.updateOrganizationLocation(
          selectedLocation.organizationId,
          selectedLocation.id,
          locationData as UpdateLocationDto
        );
        setLocations(locations.map(l => 
          l.id === selectedLocation.id ? updatedLocation : l
        ));
      } else {
        // Create new location
        const newLocation = await apiClient.createOrganizationLocation(
          (locationData as CreateLocationDto & { organizationId: string }).organizationId,
          locationData as CreateLocationDto
        );
        setLocations([...locations, newLocation]);
      }
      setShowLocationModal(false);
      setSelectedLocation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location');
    }
  };

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    return org?.name || 'Unknown Organization';
  };

  const columns = [
    { 
      key: 'name' as keyof LocationResponse,
      title: 'Name',
      render: (value: unknown, location: LocationResponse) => (
        <div>
          <div className="font-medium text-gray-900">{location.name}</div>
          {location.description && (
            <div className="text-sm text-gray-500">{location.description}</div>
          )}
        </div>
      )
    },
    { 
      key: 'address' as keyof LocationResponse,
      title: 'Address',
      render: (value: unknown, location: LocationResponse) => (
        <div className="text-sm">
          <div>{location.address}</div>
          <div className="text-gray-500">
            {location.city}, {location.state} {location.zipCode}
          </div>
        </div>
      )
    },
    { 
      key: 'organizationId' as keyof LocationResponse,
      title: 'Organization',
      render: (value: unknown, location: LocationResponse) => getOrganizationName(location.organizationId)
    },
    { 
      key: 'isPrimary' as keyof LocationResponse,
      title: 'Primary',
      render: (value: unknown, location: LocationResponse) => location.isPrimary ? 'Yes' : 'No'
    },
    { 
      key: 'isActive' as keyof LocationResponse,
      title: 'Status',
      render: (value: unknown, location: LocationResponse) => (
        <StatusBadge 
          status={location.isActive}
          activeText="Active"
          inactiveText="Inactive"
        />
      )
    },
    {
      key: 'actions' as keyof LocationResponse,
      title: 'Actions',
      render: (value: unknown, location: LocationResponse) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/organizations/${location.organizationId}/locations/${location.id}`}>
            <Button size="xs" color="blue">
              <HiEye className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="xs"
            color="yellow"
            onClick={() => handleEditLocation(location)}
          >
            <HiPencil className="w-4 h-4" />
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => handleDeleteLocation(location)}
          >
            <HiTrash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage locations across all organizations</p>
        </div>
        <Button onClick={handleCreateLocation}>
          <HiPlus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {error && <ErrorAlert message={error} />}

      <DataTable
        data={locations}
        columns={columns}
      />

      <LocationFormModal
        isOpen={showLocationModal}
        onClose={() => {
          setShowLocationModal(false);
          setSelectedLocation(null);
        }}
        onSubmit={handleLocationSubmit}
        title={selectedLocation ? 'Edit Location' : 'Create Location'}
        formData={locationFormData}
        setFormData={setLocationFormData}
        location={selectedLocation}
        organizations={organizations}
      />

      {showDeleteModal && locationToDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Location"
          message={`Are you sure you want to delete "${locationToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setLocationToDelete(null);
          }}
        />
      )}
    </div>
  );
}