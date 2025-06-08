'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Card, TextInput, Select, Tabs, TabItem } from 'flowbite-react';
import { HiCalendar, HiSearch, HiFilter, HiClock, HiUser } from 'react-icons/hi';

interface BookingHistorySectionProps {
  memberId: string;
  isOwnProfile?: boolean;
}

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  instructor: string;
  status: 'BOOKED' | 'ATTENDED' | 'NO_SHOW' | 'LATE_CANCEL' | 'CANCELLED_BY_MEMBER' | 'CANCELLED_BY_GYM';
  type: 'CLASS' | 'APPOINTMENT';
}

export function BookingHistorySection({
  memberId,
  isOwnProfile = false
}: BookingHistorySectionProps) {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterDateRange, setFilterDateRange] = useState('30_DAYS');

  // Mock data - in real app, this would come from the API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      
      // Mock upcoming bookings
      const mockUpcoming: Booking[] = [
        {
          id: '1',
          serviceName: 'Morning Yoga',
          date: '2024-06-15',
          time: '09:00',
          instructor: 'Sarah Johnson',
          status: 'BOOKED',
          type: 'CLASS'
        },
        {
          id: '2',
          serviceName: 'Personal Training',
          date: '2024-06-17',
          time: '14:00',
          instructor: 'Mike Wilson',
          status: 'BOOKED',
          type: 'APPOINTMENT'
        }
      ];

      // Mock past bookings
      const mockPast: Booking[] = [
        {
          id: '3',
          serviceName: 'HIIT Training',
          date: '2024-06-10',
          time: '18:00',
          instructor: 'Lisa Chen',
          status: 'ATTENDED',
          type: 'CLASS'
        },
        {
          id: '4',
          serviceName: 'Pilates',
          date: '2024-06-08',
          time: '10:00',
          instructor: 'Anna Martinez',
          status: 'NO_SHOW',
          type: 'CLASS'
        },
        {
          id: '5',
          serviceName: 'Personal Training',
          date: '2024-06-05',
          time: '15:00',
          instructor: 'Mike Wilson',
          status: 'ATTENDED',
          type: 'APPOINTMENT'
        }
      ];

      setUpcomingBookings(mockUpcoming);
      setPastBookings(mockPast);
      setLoading(false);
    };

    fetchBookings();
  }, [memberId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOOKED': return 'info';
      case 'ATTENDED': return 'success';
      case 'NO_SHOW': return 'failure';
      case 'LATE_CANCEL': return 'warning';
      case 'CANCELLED_BY_MEMBER': return 'gray';
      case 'CANCELLED_BY_GYM': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'BOOKED': return 'Booked';
      case 'ATTENDED': return 'Attended';
      case 'NO_SHOW': return 'No Show';
      case 'LATE_CANCEL': return 'Late Cancel';
      case 'CANCELLED_BY_MEMBER': return 'Cancelled';
      case 'CANCELLED_BY_GYM': return 'Gym Cancelled';
      default: return status;
    }
  };

  const filteredPastBookings = pastBookings.filter(booking => {
    const matchesSearch = booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || booking.type === filterType;
    
    // Date range filtering would be implemented here
    return matchesSearch && matchesType;
  });

  const BookingCard = ({ booking, showActions = false }: { booking: Booking; showActions?: boolean }) => (
    <Card key={booking.id}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {booking.type === 'CLASS' ? (
                <HiUser className="h-5 w-5 text-gray-400" />
              ) : (
                <HiClock className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {booking.serviceName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                with {booking.instructor}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <HiCalendar className="h-4 w-4" />
                  {new Date(booking.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <HiClock className="h-4 w-4" />
                  {booking.time}
                </div>
                <Badge 
                  color={getStatusColor(booking.status)}
                  size="sm"
                >
                  {getStatusText(booking.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {showActions && booking.status === 'BOOKED' && (
          <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              Modify
            </button>
            <button className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">
              Cancel
            </button>
          </div>
        )}
      </div>
    </Card>
  );

  // Calculate attendance stats
  const totalBookings = pastBookings.length;
  const attendedBookings = pastBookings.filter(b => b.status === 'ATTENDED').length;
  const noShows = pastBookings.filter(b => b.status === 'NO_SHOW').length;
  const attendanceRate = totalBookings > 0 ? Math.round((attendedBookings / totalBookings) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Booking & Attendance Log
        </h3>
        
        {/* Attendance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{attendedBookings}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attended</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{noShows}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">No Shows</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs aria-label="Booking tabs" variant="underline">
        <TabItem title={`Upcoming (${upcomingBookings.length})`} icon={HiCalendar}>
          <div className="space-y-4 mt-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <HiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Upcoming Bookings
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isOwnProfile ? "You don't have any upcoming bookings." : "This member doesn't have any upcoming bookings."}
                  </p>
                </div>
              </Card>
            ) : (
              upcomingBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  showActions={isOwnProfile}
                />
              ))
            )}
          </div>
        </TabItem>

        <TabItem title="History" icon={HiClock}>
          <div className="space-y-4 mt-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <TextInput
                  icon={HiSearch}
                  placeholder="Search bookings by service or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  icon={HiFilter}
                >
                  <option value="ALL">All Types</option>
                  <option value="CLASS">Classes</option>
                  <option value="APPOINTMENT">Appointments</option>
                </Select>
                <Select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                >
                  <option value="30_DAYS">Last 30 Days</option>
                  <option value="90_DAYS">Last 90 Days</option>
                  <option value="6_MONTHS">Last 6 Months</option>
                  <option value="1_YEAR">Last Year</option>
                  <option value="ALL">All Time</option>
                </Select>
              </div>
            </div>

            {/* History List */}
            {filteredPastBookings.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <HiClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Booking History
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || filterType !== 'ALL' 
                      ? "No bookings match your search criteria." 
                      : "No booking history available."}
                  </p>
                </div>
              </Card>
            ) : (
              filteredPastBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
}
