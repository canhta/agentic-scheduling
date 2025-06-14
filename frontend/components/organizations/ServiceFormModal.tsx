'use client';

import { Button, Label, TextInput, Textarea, Select, Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { CreateServiceDto, UpdateServiceDto, ServiceResponse } from '../../lib/types';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServiceDto | UpdateServiceDto) => void;
  title: string;
  formData: CreateServiceDto | UpdateServiceDto;
  setFormData: (data: CreateServiceDto | UpdateServiceDto) => void;
  isLoading?: boolean;
  service?: ServiceResponse | null;
  organizationLocations?: Array<{ id: string; name: string }>;
  organizationResources?: Array<{ id: string; name: string }>;
}

export function ServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  isLoading = false,
  service,
  organizationLocations = [],
  organizationResources = []
}: ServiceFormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleResourceToggle = (resourceId: string) => {
    const currentResourceIds = formData.resourceIds || [];
    const updatedResourceIds = currentResourceIds.includes(resourceId)
      ? currentResourceIds.filter(id => id !== resourceId)
      : [...currentResourceIds, resourceId];

    setFormData({ ...formData, resourceIds: updatedResourceIds });
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <ModalHeader>
        {title}
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" title="Service Name" />
              <TextInput
                id="name"
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="type" title="Service Type" />
              <Select
                id="type"
                required
                value={formData.type || 'CLASS'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                disabled={isLoading}
              >
                <option value="CLASS">Class</option>
                <option value="APPOINTMENT">Appointment</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="PERSONAL_TRAINING">Personal Training</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" title="Description" />
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration" title="Duration (minutes)" />
              <TextInput
                id="duration"
                type="number"
                min="1"
                required
                value={formData.duration?.toString() || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  duration: parseInt(e.target.value)
                })}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="capacity" title="Capacity" />
              <TextInput
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity?.toString() || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  capacity: e.target.value ? parseInt(e.target.value) : undefined
                })}
                disabled={isLoading}
                placeholder="Unlimited"
              />
            </div>

            <div>
              <Label htmlFor="price" title="Price ($)" />
              <TextInput
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price?.toString() || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  price: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                disabled={isLoading}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="locationId" title="Location" />
              <Select
                id="locationId"
                value={formData.locationId || ''}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value || undefined })}
                disabled={isLoading}
              >
                <option value="">Any location</option>
                {organizationLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="color" title="Calendar Color" />
              <TextInput
                id="color"
                type="color"
                value={formData.color || '#3B82F6'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          {organizationResources.length > 0 && (
            <div>
              <Label title="Required Resources" />
              <div className="mt-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {organizationResources.map((resource) => (
                  <div key={resource.id} className="flex items-center mb-2 last:mb-0">
                    <input
                      type="checkbox"
                      id={`resource-${resource.id}`}
                      checked={(formData.resourceIds || []).includes(resource.id)}
                      onChange={() => handleResourceToggle(resource.id)}
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`resource-${resource.id}`} className="ml-2 text-sm text-gray-900">
                      {resource.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                id="bookable"
                type="checkbox"
                checked={formData.bookable ?? true}
                onChange={(e) => setFormData({ ...formData, bookable: e.target.checked })}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="bookable" className="ml-2 text-sm font-medium text-gray-900">
                Bookable
              </Label>
            </div>

            <div className="flex items-center">
              <input
                id="requiresApproval"
                type="checkbox"
                checked={formData.requiresApproval ?? false}
                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="requiresApproval" className="ml-2 text-sm font-medium text-gray-900">
                Requires Approval
              </Label>
            </div>

            <div className="flex items-center">
              <input
                id="allowWaitlist"
                type="checkbox"
                checked={formData.allowWaitlist ?? true}
                onChange={(e) => setFormData({ ...formData, allowWaitlist: e.target.checked })}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="allowWaitlist" className="ml-2 text-sm font-medium text-gray-900">
                Allow Waitlist
              </Label>
            </div>

            {service && (
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={(formData as UpdateServiceDto).isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-900">
                  Active
                </Label>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="gray" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
