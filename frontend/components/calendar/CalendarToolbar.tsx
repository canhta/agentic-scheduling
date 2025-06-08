'use client';

import { Button, Select } from 'flowbite-react';
import { 
  HiChevronLeft, 
  HiChevronRight,
  HiPlus
} from 'react-icons/hi';

export type CalendarView = 
  | 'dayGridMonth' 
  | 'timeGridWeek' 
  | 'timeGridDay' 
  | 'listWeek'
  | 'listDay'
  | 'resourceTimeGridWeek'
  | 'resourceTimeGridDay'
  | 'resourceTimelineWeek'
  | 'resourceTimelineDay';

interface CalendarToolbarProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  currentDate: Date;
  selectedResource?: string;
  resources?: Array<{ id: string; title: string }>;
  onResourceChange?: (resourceId: string) => void;
  onCreateEvent?: () => void;
  className?: string;
}

const viewOptions = [
  { value: 'dayGridMonth', label: 'Month' },
  { value: 'timeGridWeek', label: 'Week' },
  { value: 'timeGridDay', label: 'Day' },
  { value: 'listWeek', label: 'Agenda' },
  { value: 'resourceTimeGridWeek', label: 'Resources' },
] as const;

export function CalendarToolbar({
  currentView,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  currentDate,
  selectedResource,
  resources = [],
  onResourceChange,
  onCreateEvent,
  className = '',
}: CalendarToolbarProps) {
  const formatDate = (date: Date) => {
    if (currentView === 'timeGridDay') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white border-b border-gray-200 ${className}`}>
      {/* Left section - Navigation and Create */}
      <div className="flex items-center gap-3">
        {onCreateEvent && (
          <Button 
            onClick={onCreateEvent}
            className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            size="sm"
          >
            <HiPlus className="h-4 w-4 mr-2" />
            Create
          </Button>
        )}
        
        <Button
          onClick={onToday}
          color="gray"
          size="sm"
          className="border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Today
        </Button>
        
        <div className="flex items-center gap-1 ml-2">
          <Button
            onClick={onPrevious}
            color="gray"
            size="sm"
            className="p-2 border border-gray-300 hover:bg-gray-50"
            title="Previous"
          >
            <HiChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={onNext}
            color="gray"
            size="sm"
            className="p-2 border border-gray-300 hover:bg-gray-50"
            title="Next"
          >
            <HiChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h1 className="text-xl font-normal text-gray-800 ml-4">
          {formatDate(currentDate)}
        </h1>
      </div>

      {/* Center section - Resource selector (for resource views) */}
      {currentView.includes('resource') && resources.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">
            Resource:
          </label>
          <Select
            value={selectedResource || ''}
            onChange={(e) => onResourceChange?.(e.target.value)}
            className="min-w-48"
            sizing="sm"
          >
            <option value="">All Resources</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.title}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Right section - View selector */}
      <div className="flex items-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {viewOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onViewChange(value)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                ${currentView === value 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
