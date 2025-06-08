'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Textarea, Select, Checkbox, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { HiCalendar, HiClock, HiLocationMarker, HiUser, HiUserGroup, HiRefresh } from 'react-icons/hi';
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
    color: '#3b82f6',
    type: 'booking' as 'booking' | 'recurring' | 'exception' | 'availability',
    status: 'confirmed',
  });

  const [recurrence, setRecurrence] = useState<RecurrencePattern>({
    type: 'none',
    interval: 1,
    daysOfWeek: [],
  });

  const [isRecurring, setIsRecurring] = useState(false);

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
          color: event.color || '#3b82f6',
          type: event.type,
          status: event.status || 'confirmed',
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
          color: '#3b82f6',
          type: 'booking',
          status: 'confirmed',
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
    
    if (!formData.title.trim()) {
      alert('Please enter a title for the event');
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
      color: '#3b82f6',
      type: 'booking',
      status: 'confirmed',
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
      <ModalHeader>
        <div className="flex items-center gap-2">
          <HiCalendar className="h-5 w-5" />
          {event ? 'Edit Event' : 'Create New Event'}
        </div>
      </ModalHeader>
      
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          {/* Event Title */}
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <TextInput
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Date & Time</Label>
              <div className="flex items-center gap-2">
                <HiClock className="h-4 w-4 text-gray-500" />
                <TextInput
                  id="start"
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => handleInputChange('start', e.target.value)}
                  disabled={formData.allDay}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="end">End Date & Time</Label>
              <div className="flex items-center gap-2">
                <HiClock className="h-4 w-4 text-gray-500" />
                <TextInput
                  id="end"
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => handleInputChange('end', e.target.value)}
                  disabled={formData.allDay}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => handleInputChange('allDay', e.target.checked)}
            />
            <Label htmlFor="allDay">All Day Event</Label>
          </div>

          {/* Event Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Event Type</Label>
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
              <Label htmlFor="color">Color</Label>
              <Select
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Location and Instructor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="h-4 w-4 text-gray-500" />
                <TextInput
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <div className="flex items-center gap-2">
                <HiUser className="h-4 w-4 text-gray-500" />
                <TextInput
                  id="instructor"
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  placeholder="Enter instructor name"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <div className="flex items-center gap-2">
              <HiUserGroup className="h-4 w-4 text-gray-500" />
              <TextInput
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Maximum number of participants"
                min="1"
                className="flex-1"
              />
            </div>
          </div>

          {/* Recurring Event */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <Label htmlFor="recurring" className="flex items-center gap-2">
                <HiRefresh className="h-4 w-4" />
                Recurring Event
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recurrenceType">Repeat</Label>
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
                    <Label htmlFor="interval">Every</Label>
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
                    <Label>Repeat on</Label>
                    <div className="flex gap-2 mt-2">
                      {dayLabels.map((day, index) => (
                        <label key={index} className="flex flex-col items-center">
                          <Checkbox
                            checked={recurrence.daysOfWeek?.includes(index) || false}
                            onChange={(e) => handleDayOfWeekChange(index, e.target.checked)}
                          />
                          <span className="text-xs mt-1">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
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
