'use client';

import React, { useState } from 'react';
import { Card, Button, TextInput, Textarea, Select, Badge, Modal, Accordion, Alert } from 'flowbite-react';
import { HiSupport, HiMail, HiPhone, HiChat, HiQuestionMarkCircle, HiClock, HiCheckCircle, HiExclamationCircle, HiX, HiChevronDown, HiChevronUp } from 'react-icons/hi';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  description: string;
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: string;
    message: string;
    sender: 'member' | 'staff';
    senderName: string;
    timestamp: string;
  }>;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    subject: 'Unable to book classes',
    category: 'booking',
    priority: 'medium',
    status: 'in-progress',
    description: 'I am getting an error when trying to book HIIT classes for next week.',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-19T14:30:00Z',
    responses: [
      {
        id: '1',
        message: 'Thank you for contacting us. We are looking into this issue and will get back to you shortly.',
        sender: 'staff',
        senderName: 'Support Team',
        timestamp: '2024-01-18T11:00:00Z'
      },
      {
        id: '2',
        message: 'We have identified the issue and are working on a fix. This should be resolved within 24 hours.',
        sender: 'staff',
        senderName: 'Technical Support',
        timestamp: '2024-01-19T14:30:00Z'
      }
    ]
  },
  {
    id: '2',
    subject: 'Membership billing question',
    category: 'billing',
    priority: 'low',
    status: 'resolved',
    description: 'I was charged twice for my monthly membership. Can you please check?',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-16T16:00:00Z',
    responses: [
      {
        id: '1',
        message: 'We have reviewed your account and found the duplicate charge. A refund has been processed and should appear in your account within 3-5 business days.',
        sender: 'staff',
        senderName: 'Billing Support',
        timestamp: '2024-01-16T16:00:00Z'
      }
    ]
  }
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I cancel a class booking?',
    answer: 'You can cancel a class booking up to 24 hours before the class starts. Go to "My Bookings" in your account, find the class you want to cancel, and click the "Cancel" button. Please note that cancellations made less than 24 hours before the class may result in a credit deduction.',
    category: 'booking',
    helpful: 45
  },
  {
    id: '2',
    question: 'What happens if I miss a class?',
    answer: 'If you miss a class without canceling at least 24 hours in advance, it will be marked as a "no-show" and the credit will be deducted from your account. We understand that emergencies happen, so please contact our support team if you have a valid reason for missing the class.',
    category: 'booking',
    helpful: 32
  },
  {
    id: '3',
    question: 'How do I upgrade my membership?',
    answer: 'You can upgrade your membership at any time by going to the "Membership" section in your account and selecting a new plan. The upgrade will take effect immediately, and you\'ll be charged the prorated amount for the current billing period.',
    category: 'membership',
    helpful: 28
  },
  {
    id: '4',
    question: 'Can I freeze my membership?',
    answer: 'Yes, you can freeze your membership for up to 3 months per year. During the freeze period, you won\'t be charged, but you also won\'t have access to classes. To freeze your membership, contact our support team or visit the front desk.',
    category: 'membership',
    helpful: 41
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. You can update your payment method in the billing section of your account.',
    category: 'billing',
    helpful: 23
  }
];

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking & Classes' },
    { value: 'membership', label: 'Membership' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ];

  const getStatusBadge = (status: SupportTicket['status']) => {
    const statusConfig = {
      open: { color: 'info', text: 'Open', icon: HiExclamationCircle },
      'in-progress': { color: 'warning', text: 'In Progress', icon: HiClock },
      resolved: { color: 'success', text: 'Resolved', icon: HiCheckCircle },
      closed: { color: 'gray', text: 'Closed', icon: HiCheckCircle }
    };
    
    const config = statusConfig[status];
    return (
      <Badge color={config.color}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const config = priorities.find(p => p.value === priority);
    return <Badge color={config?.color}>{config?.label}</Badge>;
  };

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = () => {
    // This would integrate with the actual support API
    console.log('Submitting ticket:', newTicket);
    setTicketSubmitted(true);
    setShowNewTicketModal(false);
    setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get help with your account, bookings, and membership
          </p>
        </div>
        <Button color="blue" onClick={() => setShowNewTicketModal(true)}>
          <HiSupport className="w-4 h-4 mr-2" />
          New Support Ticket
        </Button>
      </div>

      {/* Success Alert */}
      {ticketSubmitted && (
        <Alert color="success" onDismiss={() => setTicketSubmitted(false)}>
          <HiCheckCircle className="h-4 w-4" />
          Your support ticket has been submitted! We&apos;ll get back to you within 24 hours.
        </Alert>
      )}

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <HiMail className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Get help via email within 24 hours
            </p>
            <Button color="blue" size="sm" onClick={() => setShowNewTicketModal(true)}>
              Send Email
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <HiPhone className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Phone Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Call us for immediate assistance
            </p>
            <Button color="green" size="sm">
              <a href="tel:+1-555-123-4567">Call (555) 123-4567</a>
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <HiChat className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Live Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Chat with us in real-time
            </p>
            <Button color="purple" size="sm">
              Start Chat
            </Button>
          </div>
        </Card>
      </div>

      {/* Support Tickets */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          My Support Tickets
        </h2>

        {mockTickets.length > 0 ? (
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  setSelectedTicket(ticket);
                  setShowTicketModal(true);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {ticket.subject}
                  </h3>
                  <div className="flex gap-2">
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {ticket.description.length > 100 
                    ? ticket.description.substring(0, 100) + '...'
                    : ticket.description
                  }
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(ticket.createdAt)}</span>
                  <span>Updated: {formatDate(ticket.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <HiSupport className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No support tickets
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven&apos;t submitted any support tickets yet
            </p>
            <Button onClick={() => setShowNewTicketModal(true)}>
              Create Your First Ticket
            </Button>
          </div>
        )}
      </Card>

      {/* FAQ Section */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>

        {/* FAQ Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={HiQuestionMarkCircle}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    <Badge color="gray" className="ml-2">
                      {faq.helpful} helpful
                    </Badge>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <HiChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 mt-3">
                      {faq.answer}
                    </p>
                    <div className="flex gap-2">
                      <Button size="xs" color="green">
                        Helpful
                      </Button>
                      <Button size="xs" color="gray">
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <HiQuestionMarkCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No FAQs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </Card>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowNewTicketModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowNewTicketModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <HiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
                    Create Support Ticket
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Subject
                      </label>
                      <TextInput
                        type="text"
                        placeholder="Brief description of your issue"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Category
                        </label>
                        <Select
                          value={newTicket.category}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Priority
                        </label>
                        <Select
                          value={newTicket.priority}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                        >
                          {priorities.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Description
                      </label>
                      <Textarea
                        rows={4}
                        placeholder="Please provide a detailed description of your issue..."
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  color="blue"
                  onClick={handleSubmitTicket}
                  disabled={!newTicket.subject || !newTicket.description}
                  className="w-full sm:ml-3 sm:w-auto"
                >
                  Submit Ticket
                </Button>
                <Button color="gray" onClick={() => setShowNewTicketModal(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowTicketModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowTicketModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <HiX className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Ticket Details
                    </h3>
                    {selectedTicket && (
                      <div className="flex gap-2">
                        {getPriorityBadge(selectedTicket.priority)}
                        {getStatusBadge(selectedTicket.status)}
                      </div>
                    )}
                  </div>
                  {selectedTicket && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedTicket.description}
                        </p>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                          Conversation
                        </h4>
                        <div className="space-y-3">
                          {selectedTicket.responses.map((response) => (
                            <div
                              key={response.id}
                              className={`p-3 rounded-lg ${
                                response.sender === 'staff'
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                  : 'bg-gray-50 dark:bg-gray-800'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {response.senderName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(response.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {response.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button color="gray" onClick={() => setShowTicketModal(false)} className="w-full sm:w-auto">
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
