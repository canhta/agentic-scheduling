'use client';

import { Button, Label, TextInput, Textarea, Select, Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import type { CreateOrganizationDto, Organization } from '@/lib/types';

interface OrganizationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationDto) => void;
  title: string;
  formData: CreateOrganizationDto;
  setFormData: (data: CreateOrganizationDto) => void;
  isLoading?: boolean;
  organization?: Organization | null;
}

export function OrganizationFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  isLoading = false,
  organization
}: OrganizationFormModalProps) {
  if (!isOpen) return null;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNameChange = (name: string) => {
    setFormData({ 
      ...formData, 
      name,
      // Only auto-generate slug for new organizations
      slug: organization ? formData.slug : generateSlug(name)
    });
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <ModalHeader>
        {title}
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Organization Name *</Label>
              <TextInput
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter organization name"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <TextInput
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="organization-slug"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Organization description"
              disabled={isLoading}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@organization.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <TextInput
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <TextInput
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://www.organization.com"
              disabled={isLoading}
            />
          </div>

          {/* Location Information */}
          <div>
            <Label htmlFor="address">Address</Label>
            <TextInput
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <TextInput
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <TextInput
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <TextInput
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="ZIP Code"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              disabled={isLoading}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </Select>
          </div>

          {/* Business Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                disabled={isLoading}
              >
                <option value="gym">Gym</option>
                <option value="fitness_center">Fitness Center</option>
                <option value="yoga_studio">Yoga Studio</option>
                <option value="martial_arts">Martial Arts</option>
                <option value="dance_studio">Dance Studio</option>
                <option value="personal_training">Personal Training</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                disabled={isLoading}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
                <option value="America/Toronto">Toronto</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                disabled={isLoading}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
              </Select>
            </div>
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
            {isLoading ? 'Saving...' : organization ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}