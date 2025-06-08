'use client';

import { useState, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface MiniCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export function MiniCalendar({ currentDate, onDateSelect, className = '' }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: isSameDay(prevDate, new Date()),
        isSelected: isSameDay(prevDate, currentDate),
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, currentDate),
      });
    }

    // Add days from next month to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: isSameDay(nextDate, new Date()),
        isSelected: isSameDay(nextDate, currentDate),
      });
    }

    return days;
  }, [currentDate]);

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const days = getDaysInMonth(viewDate);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <HiChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        
        <h3 className="text-sm font-semibold text-gray-900">
          {formatMonthYear(viewDate)}
        </h3>
        
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <HiChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((label, index) => (
          <div key={index} className="text-xs font-medium text-gray-500 text-center py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day.date)}
            className={`
              h-8 w-8 text-xs rounded-md transition-colors flex items-center justify-center
              ${day.isCurrentMonth 
                ? 'text-gray-900 hover:bg-gray-100' 
                : 'text-gray-400 hover:bg-gray-50'}
              ${day.isToday 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : ''}
              ${day.isSelected && !day.isToday 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : ''}
            `}
            aria-label={day.date.toLocaleDateString()}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
