'use client';

import { Button, Select } from 'flowbite-react';
import { 
  HiChevronLeft, 
  HiChevronRight, 
  HiCalendar,
  HiViewGrid,
  HiViewList,
  HiClock,
  HiOfficeBuilding
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
  { value: 'dayGridMonth', label: 'Month', icon: HiViewGrid },
  { value: 'timeGridWeek', label: 'Week', icon: HiViewList },
  { value: 'timeGridDay', label: 'Day', icon: HiClock },
  { value: 'listWeek', label: 'List Week', icon: HiViewList },
  { value: 'resourceTimeGridWeek', label: 'Resource Week', icon: HiOfficeBuilding },
  { value: 'resourceTimeGridDay', label: 'Resource Day', icon: HiOfficeBuilding },
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

      {/* Center section - Resource selector (for resource view) */}
      {currentView === 'resourceTimeGridDay' && resources.length > 0 && (
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

      {/* Right section - View buttons */}
      <div className="flex items-center gap-1">
        {viewOptions.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            size="sm"
            color={currentView === value ? 'blue' : 'gray'}
            onClick={() => onViewChange(value)}
            className="flex items-center gap-1.5"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
