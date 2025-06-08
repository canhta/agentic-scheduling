'use client';

import { Button, Select } from 'flowbite-react';
import { 
  HiChevronLeft, 
  HiChevronRight
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
  className?: string;
}

const viewOptions = [
  { value: 'dayGridMonth', label: 'Month' },
  { value: 'timeGridWeek', label: 'Week' },
  { value: 'timeGridDay', label: 'Day' },
  { value: 'listWeek', label: 'List Week' },
  { value: 'resourceTimeGridWeek', label: 'Resource Week' },
  { value: 'resourceTimeGridDay', label: 'Resource Day' },
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
  className = '',
}: CalendarToolbarProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      ...(currentView === 'timeGridDay' && { day: 'numeric' }),
    });
  };

  return (
    <div className={`flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200 ${className}`}>
      {/* Left section - Navigation */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          color="gray"
          onClick={onToday}
          className="whitespace-nowrap"
        >
          Today
        </Button>
        
        <div className="flex items-center">
          <Button
            size="sm"
            color="gray"
            onClick={onPrevious}
            className="rounded-r-none border-r-0"
          >
            <HiChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            color="gray"
            onClick={onNext}
            className="rounded-l-none"
          >
            <HiChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 ml-4">
          {formatDate(currentDate)}
        </h2>
      </div>

      {/* Center section - Resource selector (for resource views) */}
      {currentView.includes('resource') && resources.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
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
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          View:
        </label>
        <Select
          value={currentView}
          onChange={(e) => onViewChange(e.target.value as CalendarView)}
          className="min-w-40"
          sizing="sm"
        >
          {viewOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
