'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Tabs, TabItem, Select, TextInput } from 'flowbite-react';
import { HiCalendar, HiClock, HiLocationMarker, HiX, HiSearch, HiFilter, HiEye } from 'react-icons/hi';

interface Booking {
  id: string;
  className: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  status: 'confirmed' | 'waitlisted' | 'completed' | 'cancelled' | 'no-show';
  attendanceMarked?: boolean;
  credits: number;
  bookedAt: string;
  description?: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    className: 'HIIT Training',
    instructor: 'Sarah Johnson',
    date: '2024-01-20',
    time: '08:00',
    duration: 45,
    location: 'Studio A',
    status: 'confirmed',
    credits: 1,
    bookedAt: '2024-01-18T10:30:00Z',
    description: 'High-intensity interval training focused on cardio and strength.'
  },
  {
    id: '2',
    className: 'Yoga Flow',
    instructor: 'Emma Wilson',
    date: '2024-01-22',
    time: '18:30',
    duration: 60,
    location: 'Studio B',
    status: 'confirmed',
    credits: 1,
    bookedAt: '2024-01-19T14:15:00Z',
    description: 'A flowing yoga practice connecting breath with movement.'
  },
  {
    id: '3',
    className: 'Strength Training',
    instructor: 'Mike Chen',
    date: '2024-01-15',
    time: '07:00',
    duration: 60,
    location: 'Gym Floor',
    status: 'completed',
    attendanceMarked: true,
    credits: 1,
    bookedAt: '2024-01-13T16:45:00Z',
    description: 'Full-body strength training with free weights and machines.'
  },
  {
    id: '4',
    className: 'Pilates',
    instructor: 'Lisa Garcia',
    date: '2024-01-12',
    time: '19:00',
    duration: 50,
    location: 'Studio C',
    status: 'no-show',
    attendanceMarked: false,
    credits: 1,
    bookedAt: '2024-01-10T11:20:00Z',
    description: 'Core-focused Pilates class for all fitness levels.'
  },
  {
    id: '5',
    className: 'Spin Class',
    instructor: 'David Brown',
    date: '2024-01-10',
    time: '06:30',
    duration: 45,
    location: 'Spin Studio',
    status: 'cancelled',
    credits: 0,
    bookedAt: '2024-01-08T09:10:00Z',
    description: 'High-energy cycling workout with music.'
  }
];

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  const upcomingBookings = mockBookings.filter(booking => 
    new Date(booking.date + 'T' + booking.time) > new Date() && 
    booking.status !== 'cancelled'
  );

  const pastBookings = mockBookings.filter(booking => 
    new Date(booking.date + 'T' + booking.time) <= new Date() || 
    booking.status === 'cancelled'
  );

  const filteredBookings = (bookings: Booking[]) => {
    return bookings.filter(booking => {
      const matchesSearch = booking.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status: Booking['status']) => {
    const statusConfig = {
      confirmed: { color: 'success', text: 'Confirmed' },
      waitlisted: { color: 'warning', text: 'Waitlisted' },
      completed: { color: 'info', text: 'Completed' },
      cancelled: { color: 'failure', text: 'Cancelled' },
      'no-show': { color: 'failure', text: 'No Show' }
    };
    
    const config = statusConfig[status];
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canCancelBooking = (booking: Booking) => {
    const classDateTime = new Date(booking.date + 'T' + booking.time);
    const now = new Date();
    const hoursUntilClass = (classDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilClass > 24 && booking.status === 'confirmed';
  };

  const handleCancelBooking = (bookingId: string) => {
    // This would integrate with the actual booking API
    console.log('Cancelling booking:', bookingId);
    // Show success message
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {booking.className}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                with {booking.instructor}
              </p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <HiCalendar className="w-4 h-4" />
              {formatDate(booking.date)}
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="w-4 h-4" />
              {formatTime(booking.time)} ({booking.duration}min)
            </div>
            <div className="flex items-center gap-2">
              <HiLocationMarker className="w-4 h-4" />
              {booking.location}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            color="light"
            onClick={() => {
              setSelectedBooking(booking);
              setShowBookingModal(true);
            }}
          >
            <HiEye className="w-4 h-4 mr-1" />
            View
          </Button>
          
          {canCancelBooking(booking) && (
            <Button
              size="sm"
              color="failure"
              onClick={() => handleCancelBooking(booking.id)}
            >
              <HiX className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your class bookings and view your attendance history
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Search classes or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={HiSearch}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bookings Tabs */}
      <Tabs
        aria-label="Bookings tabs"
        onActiveTabChange={setActiveTab}
      >
        <TabItem
          active={activeTab === 0}
          title={`Upcoming (${filteredBookings(upcomingBookings).length})`}
        >
          <div className="space-y-4">
            {filteredBookings(upcomingBookings).length > 0 ? (
              filteredBookings(upcomingBookings).map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <div className="text-center py-8">
                  <HiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Book your next class to see it here
                  </p>
                  <Button href="/classes">Browse Classes</Button>
                </div>
              </Card>
            )}
          </div>
        </TabItem>

        <TabItem
          active={activeTab === 1}
          title={`Past (${filteredBookings(pastBookings).length})`}
        >
          <div className="space-y-4">
            {filteredBookings(pastBookings).length > 0 ? (
              filteredBookings(pastBookings).map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <div className="text-center py-8">
                  <HiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No past bookings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your booking history will appear here
                  </p>
                </div>
              </Card>
            )}
          </div>
        </TabItem>
      </Tabs>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowBookingModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                    Booking Details
                  </h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedBooking.className}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        with {selectedBooking.instructor}
                      </p>
                    </div>
                    {getStatusBadge(selectedBooking.status)}
                  </div>

                  {selectedBooking.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedBooking.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Date & Time</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDate(selectedBooking.date)} at {formatTime(selectedBooking.time)}
                      </p>
                      <p className="text-sm text-gray-500">Duration: {selectedBooking.duration} minutes</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Location</h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedBooking.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Credits Used</h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedBooking.credits} credit(s)</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Booked On</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(selectedBooking.bookedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {selectedBooking.status === 'completed' && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Attendance</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedBooking.attendanceMarked ? 'Attended' : 'Not marked'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {canCancelBooking(selectedBooking) && (
                  <Button
                    color="failure"
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      setShowBookingModal(false);
                    }}
                    className="mr-3"
                  >
                    Cancel Booking
                  </Button>
                )}
                <Button color="gray" onClick={() => setShowBookingModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
