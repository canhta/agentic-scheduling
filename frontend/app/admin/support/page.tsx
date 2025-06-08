'use client';

import React, { useState } from 'react';
import { Card, Button, TextInput, Label, Select, Badge, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Modal, ModalHeader, ModalBody, ModalFooter, Textarea } from 'flowbite-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { 
  HiSearch, 
  HiFilter, 
  HiPlus, 
  HiEye, 
  HiReply, 
  HiX,
  HiExclamationCircle,
  HiCheckCircle,
  HiClock,
  HiChat,
  HiPhone,
  HiMail
} from 'react-icons/hi';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'general' | 'feature_request';
  user: {
    name: string;
    email: string;
    role: string;
  };
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: number;
}

const AdminSupportPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      subject: 'Unable to book appointments',
      description: 'Users are experiencing issues when trying to book appointments. The system shows an error message.',
      status: 'open',
      priority: 'high',
      category: 'technical',
      user: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        role: 'Member'
      },
      assignedTo: 'Support Team',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      responses: 0
    },
    {
      id: 'TKT-002',
      subject: 'Billing discrepancy',
      description: 'My monthly membership fee was charged twice this month. Please help resolve this issue.',
      status: 'in_progress',
      priority: 'medium',
      category: 'billing',
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        role: 'Premium Member'
      },
      assignedTo: 'Finance Team',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      responses: 2
    },
    {
      id: 'TKT-003',
      subject: 'Feature request: Group bookings',
      description: 'Would love to see the ability to book multiple people for the same session.',
      status: 'resolved',
      priority: 'low',
      category: 'feature_request',
      user: {
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        role: 'Member'
      },
      assignedTo: 'Product Team',
      createdAt: '2024-01-10T16:45:00Z',
      updatedAt: '2024-01-14T11:30:00Z',
      responses: 5
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'red', icon: HiExclamationCircle },
      in_progress: { color: 'yellow', icon: HiClock },
      resolved: { color: 'green', icon: HiCheckCircle },
      closed: { color: 'gray', icon: HiX }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge color={config.color} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: 'info',
      medium: 'warning', 
      high: 'failure',
      urgent: 'purple'
    };
    
    return (
      <Badge color={priorityColors[priority as keyof typeof priorityColors]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleReply = () => {
    if (selectedTicket && replyText.trim()) {
      // Simulate sending reply
      alert('Reply sent successfully!');
      setReplyText('');
      setIsViewModalOpen(false);
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  return (
    <ProtectedRoute requireRole={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF]}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Support Management</h1>
          <p className="text-gray-600">Manage customer support tickets and inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Tickets</p>
                <p className="text-2xl font-bold text-red-600">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <HiExclamationCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <HiClock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
              <HiCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">2.5h</p>
              </div>
              <HiClock className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" title="Search tickets" />
              <TextInput
                id="search"
                icon={HiSearch}
                placeholder="Search by ticket ID, subject, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="status" title="Status" />
              <Select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority" title="Priority" />
              <Select
                id="priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" title="Category" />
              <Select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="general">General</option>
                <option value="feature_request">Feature Request</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tickets Table */}
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
            <Button color="blue" size="sm">
              <HiPlus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>

          <Table hoverable>
            <TableHead>
              <TableHeadCell>Ticket ID</TableHeadCell>
              <TableHeadCell>Subject</TableHeadCell>
              <TableHeadCell>User</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Priority</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Assigned To</TableHeadCell>
              <TableHeadCell>Last Updated</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="bg-white">
                  <TableCell className="font-medium text-gray-900">
                    {ticket.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.subject}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {ticket.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.user.name}</p>
                      <p className="text-sm text-gray-500">{ticket.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(ticket.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(ticket.priority)}
                  </TableCell>
                  <TableCell>
                    <Badge color="gray">
                      {ticket.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="blue"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <HiEye className="w-3 h-3" />
                      </Button>
                      <Select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tickets found matching your criteria.</p>
            </div>
          )}
        </Card>

        {/* View Ticket Modal */}
        <Modal show={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="xl">
          <ModalHeader>
            Ticket Details - {selectedTicket?.id}
          </ModalHeader>
          <ModalBody>
            {selectedTicket && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label title="Subject" />
                    <p className="font-medium text-gray-900">{selectedTicket.subject}</p>
                  </div>
                  <div>
                    <Label title="Status" />
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <div>
                    <Label title="Priority" />
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <div>
                    <Label title="Category" />
                    <Badge color="gray">
                      {selectedTicket.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label title="User" />
                    <p className="font-medium text-gray-900">{selectedTicket.user.name}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.user.email}</p>
                  </div>
                  <div>
                    <Label title="Assigned To" />
                    <p className="text-gray-900">{selectedTicket.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>

                <div>
                  <Label title="Description" />
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{selectedTicket.description}</p>
                  </div>
                </div>

                <div>
                  <Label title="Quick Actions" />
                  <div className="flex gap-2">
                    <Button size="sm" color="blue">
                      <HiPhone className="w-4 h-4 mr-2" />
                      Call User
                    </Button>
                    <Button size="sm" color="green">
                      <HiMail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button size="sm" color="purple">
                      <HiChat className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reply" title="Add Reply" />
                  <Textarea
                    id="reply"
                    placeholder="Type your response here..."
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="blue" onClick={handleReply}>
              <HiReply className="w-4 h-4 mr-2" />
              Send Reply
            </Button>
            <Button color="gray" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default AdminSupportPage;
