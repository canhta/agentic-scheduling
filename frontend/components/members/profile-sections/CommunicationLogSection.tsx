'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, TextInput, Select, Textarea, Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import {  HiPhone, HiChatBubbleLeftRight, HiEye, HiPlus, } from 'react-icons/hi2';
import { HiFilter, HiMail, HiSearch } from 'react-icons/hi';

interface CommunicationRecord {
  id: string;
  type: 'email' | 'sms' | 'in_app' | 'phone';
  subject: string;
  content: string;
  sentAt: string;
  sentBy: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  recipient: string;
  category: 'booking' | 'membership' | 'promotional' | 'system' | 'support';
}

interface CommunicationLogSectionProps {
  memberId: string;
  isOwnProfile: boolean;
  communications: CommunicationRecord[];
  onSendCommunication?: (communication: Omit<CommunicationRecord, 'id' | 'sentAt' | 'sentBy' | 'status'>) => void;
}

export default function CommunicationLogSection({
  memberId,
  isOwnProfile,
  communications,
  onSendCommunication
}: CommunicationLogSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedCommunication, setSelectedCommunication] = useState<CommunicationRecord | null>(null);
  const [showNewCommunicationModal, setShowNewCommunicationModal] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'email' as const,
    subject: '',
    content: '',
    recipient: '',
    category: 'support' as const
  });

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesCategory = filterCategory === 'all' || comm.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <HiMail className="w-4 h-4" />;
      case 'sms': return <HiPhone className="w-4 h-4" />;
      case 'phone': return <HiPhone className="w-4 h-4" />;
      default: return <HiChatBubbleLeftRight className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'info';
      case 'delivered': return 'success';
      case 'read': return 'success';
      case 'failed': return 'failure';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return 'blue';
      case 'membership': return 'green';
      case 'promotional': return 'purple';
      case 'system': return 'gray';
      case 'support': return 'yellow';
      default: return 'gray';
    }
  };

  const handleSendCommunication = () => {
    if (onSendCommunication && newCommunication.subject && newCommunication.content) {
      onSendCommunication(newCommunication);
      setNewCommunication({
        type: 'email',
        subject: '',
        content: '',
        recipient: '',
        category: 'support'
      });
      setShowNewCommunicationModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Communication Log
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isOwnProfile ? 
              'View all communications sent to you by the system and staff.' :
              'View and manage all communications sent to this member.'
            }
          </p>
        </div>
        
        {!isOwnProfile && (
          <Button
            onClick={() => setShowNewCommunicationModal(true)}
            className="self-start"
          >
            <HiPlus className="w-4 h-4 mr-2" />
            Send Communication
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <TextInput
              icon={HiSearch}
              placeholder="Search communications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            icon={HiFilter}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="in_app">In-App</option>
            <option value="phone">Phone</option>
          </Select>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="booking">Booking</option>
            <option value="membership">Membership</option>
            <option value="promotional">Promotional</option>
            <option value="system">System</option>
            <option value="support">Support</option>
          </Select>
        </div>
      </Card>

      {/* Communication List */}
      <div className="space-y-4">
        {filteredCommunications.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <HiChatBubbleLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                  ? 'No communications match your search criteria.'
                  : 'No communications found.'
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredCommunications.map((comm) => (
            <Card key={comm.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(comm.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {comm.subject}
                      </h4>
                      <Badge color={getCategoryColor(comm.category)} size="sm">
                        {comm.category}
                      </Badge>
                      <Badge color={getStatusColor(comm.status)} size="sm">
                        {comm.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {comm.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Sent by {comm.sentBy} • {new Date(comm.sentAt).toLocaleDateString()}
                      </span>
                      <span>To: {comm.recipient}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  color="gray"
                  onClick={() => setSelectedCommunication(comm)}
                >
                  <HiEye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Communication Detail Modal */}
      <Modal
        show={selectedCommunication !== null}
        onClose={() => setSelectedCommunication(null)}
        size="2xl"
      >
        <ModalHeader>
          Communication Details
        </ModalHeader>
        <ModalBody>
          {selectedCommunication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedCommunication.type)}
                    <span className="capitalize">{selectedCommunication.type}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <Badge color={getStatusColor(selectedCommunication.status)}>
                    {selectedCommunication.status}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <Badge color={getCategoryColor(selectedCommunication.category)}>
                    {selectedCommunication.category}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sent Date
                  </label>
                  <span>{new Date(selectedCommunication.sentAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedCommunication.subject}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipient
                </label>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCommunication.recipient}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sent By
                </label>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCommunication.sentBy}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {selectedCommunication.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* New Communication Modal */}
      <Modal
        show={showNewCommunicationModal}
        onClose={() => setShowNewCommunicationModal(false)}
        size="2xl"
      >
        <ModalHeader>
          Send New Communication
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <Select
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication({
                    ...newCommunication,
                    type: e.target.value as any
                  })}
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="in_app">In-App Notification</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <Select
                  value={newCommunication.category}
                  onChange={(e) => setNewCommunication({
                    ...newCommunication,
                    category: e.target.value as any
                  })}
                >
                  <option value="support">Support</option>
                  <option value="booking">Booking</option>
                  <option value="membership">Membership</option>
                  <option value="promotional">Promotional</option>
                  <option value="system">System</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipient
              </label>
              <TextInput
                placeholder="Email or phone number"
                value={newCommunication.recipient}
                onChange={(e) => setNewCommunication({
                  ...newCommunication,
                  recipient: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <TextInput
                placeholder="Communication subject"
                value={newCommunication.subject}
                onChange={(e) => setNewCommunication({
                  ...newCommunication,
                  subject: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <Textarea
                rows={6}
                placeholder="Enter your message..."
                value={newCommunication.content}
                onChange={(e) => setNewCommunication({
                  ...newCommunication,
                  content: e.target.value
                })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSendCommunication}>
            Send Communication
          </Button>
          <Button color="gray" onClick={() => setShowNewCommunicationModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
