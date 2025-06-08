'use client';

import { Button, Label, TextInput, Textarea, Select } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { CreateResourceDto, UpdateResourceDto, ResourceResponse } from '../../lib/types';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateResourceDto | UpdateResourceDto) => void;
  title: string;
  formData: CreateResourceDto | UpdateResourceDto;
  setFormData: (data: CreateResourceDto | UpdateResourceDto) => void;
  isLoading?: boolean;
  resource?: ResourceResponse | null;
  organizationLocations?: Array<{ id: string; name: string }>;
}

export function ResourceFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  isLoading = false,
  resource,
  organizationLocations = []
}: ResourceFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" title="Resource Name" />
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
                <Label htmlFor="type" title="Resource Type" />
                <Select
                  id="type"
                  required
                  value={formData.type || 'ROOM'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ROOM' | 'EQUIPMENT' })}
                  disabled={isLoading}
                >
                  <option value="ROOM">Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </Select>
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
                  placeholder="Leave empty if not applicable"
                />
              </div>

              <div>
                <Label htmlFor="locationId" title="Location" />
                <Select
                  id="locationId"
                  value={formData.locationId || ''}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value || undefined })}
                  disabled={isLoading}
                >
                  <option value="">No specific location</option>
                  {organizationLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="isBookable"
                    type="checkbox"
                    checked={formData.isBookable ?? true}
                    onChange={(e) => setFormData({ ...formData, isBookable: e.target.checked })}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Label htmlFor="isBookable" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Bookable
                  </Label>
                </div>

                {resource && (
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={(formData as UpdateResourceDto).isActive ?? true}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Active
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button color="gray" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : resource ? 'Update Resource' : 'Create Resource'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
