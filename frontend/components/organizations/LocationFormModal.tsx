'use client';

import { Button, Label, TextInput, Textarea, Select, Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { CreateLocationDto, UpdateLocationDto, LocationResponse, Organization } from '../../lib/types';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLocationDto | UpdateLocationDto) => void;
  title: string;
  formData: CreateLocationDto | UpdateLocationDto;
  setFormData: (data: CreateLocationDto | UpdateLocationDto) => void;
  isLoading?: boolean;
  location?: LocationResponse | null;
  organizations?: Organization[];
  organizationId?: string;
}

export function LocationFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  isLoading = false,
  location,
  organizations = [],
  organizationId
}: LocationFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isCreateMode = !location;
  const showOrganizationSelect = isCreateMode && organizations.length > 0 && !organizationId;

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <ModalHeader>
        {title}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          {/* Organization Selection (only for create mode without specified org) */}
          {showOrganizationSelect && (
            <div>
              <Label htmlFor="organizationId">Organization *</Label>
              <Select
                id="organizationId"
                value={(formData as any).organizationId || ''}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value } as any)}
                required
                disabled={isLoading}
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <Label htmlFor="name">Location Name *</Label>
            <TextInput
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter location name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Location description"
              disabled={isLoading}
            />
          </div>

          {/* Address Information */}
          <div>
            <Label htmlFor="address">Address *</Label>
            <TextInput
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <TextInput
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <TextInput
                id="state"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <TextInput
                id="zipCode"
                value={formData.zipCode || ''}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="ZIP Code"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country *</Label>
            <Select
              id="country"
              value={formData.country || 'US'}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
              disabled={isLoading}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="MX">Mexico</option>
              <option value="JP">Japan</option>
              <option value="BR">Brazil</option>
              <option value="IN">India</option>
            </Select>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="location@organization.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="isPrimary"
                type="checkbox"
                checked={(formData as any).isPrimary ?? false}
                onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked } as any)}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor="isPrimary" className="ml-2 text-sm font-medium text-gray-900">
                Primary Location
              </Label>
            </div>

            {location && (
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={(formData as UpdateLocationDto).isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-900">
                  Active
                </Label>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : location ? 'Update Location' : 'Create Location'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
