'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea, Select, Checkbox, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { HiCalendar, HiClock, HiLocationMarker, HiUser, HiUserGroup, HiRefresh, HiX, HiCheck, HiExclamation } from 'react-icons/hi';
import type { CalendarEvent } from '@/lib/types';

interface EventFormModalProps {
  event?: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  selectedDate?: Date | null;
  selectedStartTime?: Date | null;
  selectedEndTime?: Date | null;
}

interface RecurrencePattern {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
  occurrences?: number;
}

interface FormValidation {
  title: boolean;
  startTime: boolean;
  endTime: boolean;
}

export function EventFormModal({
  event,
  isOpen,
  onClose,
  onSave,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
}: EventFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    allDay: false,
    location: '',
    instructor: '',
    capacity: '',
    color: '#1a73e8',
    type: 'booking' as 'booking' | 'recurring' | 'exception' | 'availability',
    status: 'confirmed',
    description: '',
  });

  const [recurrence, setRecurrence] = useState<RecurrencePattern>({
    type: 'none',
    interval: 1,
    daysOfWeek: [],
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormValidation>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Initialize form data when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setFormData({
          title: event.title,
          start: new Date(event.start).toISOString().slice(0, 16),
          end: new Date(event.end).toISOString().slice(0, 16),
          allDay: event.allDay,
          location: event.location || '',
          instructor: event.instructor || '',
          capacity: event.capacity?.toString() || '',
          color: event.color || '#1a73e8',
          type: event.type,
          status: event.status || 'confirmed',
          description: '',
        });
        setIsRecurring(event.type === 'recurring');
      } else {
        // Creating new event
        const startDate = selectedStartTime || selectedDate || new Date();
        const endDate = selectedEndTime || new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

        setFormData({
          title: '',
          start: startDate.toISOString().slice(0, 16),
          end: endDate.toISOString().slice(0, 16),
          allDay: false,
          location: '',
          instructor: '',
          capacity: '',
          color: '#1a73e8',
          type: 'booking',
          status: 'confirmed',
          description: '',
        });
        setIsRecurring(false);
      }
    }
  }, [isOpen, event, selectedDate, selectedStartTime, selectedEndTime]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.title.trim()) {
      newErrors.push('Event title is required');
    }
    
    if (!formData.start) {
      newErrors.push('Start time is required');
    }
    
    if (!formData.end) {
      newErrors.push('End time is required');
    }
    
    if (formData.start && formData.end && new Date(formData.end) <= new Date(formData.start)) {
      newErrors.push('End time must be after start time');
    }
    
    return newErrors;
  };

  const handleRecurrenceChange = (field: string, value: any) => {
    setRecurrence(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDayOfWeekChange = (day: number, checked: boolean) => {
    setRecurrence(prev => ({
      ...prev,
      daysOfWeek: checked
        ? [...(prev.daysOfWeek || []), day].sort()
        : (prev.daysOfWeek || []).filter(d => d !== day),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    const eventData: Omit<CalendarEvent, 'id'> & { id?: string } = {
      ...formData,
      id: event?.id,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      type: isRecurring ? 'recurring' : formData.type,
      // Add recurrence data if it's a recurring event
      ...(isRecurring && recurrence.type !== 'none' && {
        recurringScheduleId: event?.recurringScheduleId || `recurring_${Date.now()}`,
      }),
    };

    onSave(eventData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      start: '',
      end: '',
      allDay: false,
      location: '',
      instructor: '',
      capacity: '',
      color: '#1a73e8',
      type: 'booking',
      status: 'confirmed',
      description: '',
    });
    setRecurrence({
      type: 'none',
      interval: 1,
      daysOfWeek: [],
    });
    setIsRecurring(false);
    onClose();
  };

  const eventTypeOptions = [
    { value: 'booking', label: 'Booking' },
    { value: 'availability', label: 'Availability' },
    { value: 'exception', label: 'Exception' },
  ];

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#ef4444', label: 'Red' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#f97316', label: 'Orange' },
    { value: '#84cc16', label: 'Lime' },
  ];

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal show={isOpen} onClose={handleClose} size="xl" className="z-[1001]">
      <ModalHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <HiCalendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {event ? 'Edit Event' : 'Create New Event'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {event ? 'Make changes to your event' : 'Add a new event to your calendar'}
            </p>
          </div>
        </div>
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-6">
          {/* Event Title */}
          <div>
            <Label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900">
              Event Title *
            </Label>
            <TextInput
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Add title"
              required
              className="w-full"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => handleInputChange('allDay', e.target.checked)}
            />
            <Label htmlFor="allDay" className="text-sm font-medium text-gray-700 cursor-pointer">
              All day
            </Label>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start" className="mb-2 block text-sm font-medium text-gray-900">
                Start
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiClock className="h-4 w-4 text-gray-400" />
                </div>
                <TextInput
                  id="start"
                  type={formData.allDay ? "date" : "datetime-local"}
                  value={formData.allDay ? formData.start.split('T')[0] : formData.start}
                  onChange={(e) => handleInputChange('start', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="end" className="mb-2 block text-sm font-medium text-gray-900">
                End
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiClock className="h-4 w-4 text-gray-400" />
                </div>
                <TextInput
                  id="end"
                  type={formData.allDay ? "date" : "datetime-local"}
                  value={formData.allDay ? formData.end.split('T')[0] : formData.end}
                  onChange={(e) => handleInputChange('end', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Location and Instructor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="mb-2 block text-sm font-medium text-gray-900">
                Location
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiLocationMarker className="h-4 w-4 text-gray-400" />
                </div>
                <TextInput
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Add location"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="instructor" className="mb-2 block text-sm font-medium text-gray-900">
                Instructor
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HiUser className="h-4 w-4 text-gray-400" />
                </div>
                <TextInput
                  id="instructor"
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  placeholder="Add instructor"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Event Type and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-900">
                Event Type
              </Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {eventTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-900">
                Color
              </Label>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: formData.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <span className="text-sm text-gray-600">
                  {colorOptions.find(c => c.value === formData.color)?.label || 'Custom'}
                </span>
              </div>
              {showColorPicker && (
                <div className="absolute mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map(option => (
                      <div
                        key={option.value}
                        className={`w-7 h-7 rounded-full cursor-pointer transition-all hover:scale-110 ${
                          formData.color === option.value ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: option.value }}
                        onClick={() => {
                          handleInputChange('color', option.value);
                          setShowColorPicker(false);
                        }}
                        title={option.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <Label htmlFor="capacity" className="mb-2 block text-sm font-medium text-gray-900">
              Capacity (Optional)
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiUserGroup className="h-4 w-4 text-gray-400" />
              </div>
              <TextInput
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Maximum participants"
                min="1"
                className="pl-10"
              />
            </div>
          </div>

          {/* Recurring Event */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <Label htmlFor="recurring" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-900">
                <HiRefresh className="h-4 w-4" />
                Repeat
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-4 ml-6 border-l-2 border-gray-200 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recurrenceType" className="mb-2 block text-sm font-medium text-gray-900">
                      Repeat
                    </Label>
                    <Select
                      id="recurrenceType"
                      value={recurrence.type}
                      onChange={(e) => handleRecurrenceChange('type', e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="interval" className="mb-2 block text-sm font-medium text-gray-900">
                      Every
                    </Label>
                    <TextInput
                      id="interval"
                      type="number"
                      value={recurrence.interval}
                      onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                      min="1"
                      max="99"
                    />
                  </div>
                </div>

                {recurrence.type === 'weekly' && (
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-gray-900">
                      Repeat on
                    </Label>
                    <div className="flex gap-2">
                      {dayLabels.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Checkbox
                            checked={recurrence.daysOfWeek?.includes(index) || false}
                            onChange={(e) => handleDayOfWeekChange(index, e.target.checked)}
                          />
                          <span className="text-xs text-gray-600 mt-1">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="endDate" className="mb-2 block text-sm font-medium text-gray-900">
                    End Date (Optional)
                  </Label>
                  <TextInput
                    id="endDate"
                    type="date"
                    value={recurrence.endDate?.toISOString().slice(0, 10) || ''}
                    onChange={(e) => handleRecurrenceChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button type="submit" color="blue">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
          <Button color="gray" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
