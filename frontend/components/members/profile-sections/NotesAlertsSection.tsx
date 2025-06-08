'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, TextInput, Select, Textarea, Modal, Alert, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { 
  HiExclamationTriangle, 
  HiInformationCircle, 
  HiCheckCircle, 
  HiXCircle,
  HiPlus, 
  HiPencil, 
  HiTrash,
  HiEye,
} from 'react-icons/hi2';
import { HiFilter, HiSearch } from 'react-icons/hi';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  category: 'general' | 'behavior' | 'medical' | 'billing' | 'equipment' | 'other';
  isPrivate: boolean;
}

interface AlertFlag {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface NotesAlertsSectionProps {
  memberId: string;
  isOwnProfile: boolean;
  userRole: 'member' | 'admin' | 'staff';
  notes: Note[];
  alerts: AlertFlag[];
  onAddNote?: (note: Omit<Note, 'id' | 'createdAt' | 'createdBy'>) => void;
  onUpdateNote?: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote?: (noteId: string) => void;
  onAddAlert?: (alert: Omit<AlertFlag, 'id' | 'createdAt' | 'createdBy'>) => void;
  onUpdateAlert?: (alertId: string, updates: Partial<AlertFlag>) => void;
  onDeleteAlert?: (alertId: string) => void;
}

export default function NotesAlertsSection({
  memberId,
  isOwnProfile,
  userRole,
  notes,
  alerts,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddAlert,
  onUpdateAlert,
  onDeleteAlert
}: NotesAlertsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showActiveAlertsOnly, setShowActiveAlertsOnly] = useState(true);
  
  // Modal states
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingAlert, setEditingAlert] = useState<AlertFlag | null>(null);
  
  // Form states
  const [noteForm, setNoteForm] = useState({
    content: '',
    category: 'general' as Note['category'],
    isPrivate: false
  });
  
  const [alertForm, setAlertForm] = useState({
    type: 'info' as 'warning' | 'info' | 'success' | 'danger',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    isActive: true,
    expiresAt: ''
  });

  const canManageNotes = userRole === 'admin' || userRole === 'staff';
  const canManageAlerts = userRole === 'admin' || userRole === 'staff';

  // Filter notes and alerts
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesActive = !showActiveAlertsOnly || alert.isActive;
    return matchesSearch && matchesPriority && matchesActive;
  });

  const handleAddNote = () => {
    if (onAddNote && noteForm.content.trim()) {
      onAddNote(noteForm);
      setNoteForm({ content: '', category: 'general', isPrivate: false });
      setShowNoteModal(false);
    }
  };

  const handleUpdateNote = () => {
    if (onUpdateNote && editingNote && noteForm.content.trim()) {
      onUpdateNote(editingNote.id, noteForm);
      setEditingNote(null);
      setNoteForm({ content: '', category: 'general', isPrivate: false });
      setShowNoteModal(false);
    }
  };

  const handleAddAlert = () => {
    if (onAddAlert && alertForm.title.trim()) {
      onAddAlert({
        ...alertForm,
        expiresAt: alertForm.expiresAt || undefined
      });
      setAlertForm({
        type: 'info',
        title: '',
        description: '',
        priority: 'medium',
        isActive: true,
        expiresAt: ''
      });
      setShowAlertModal(false);
    }
  };

  const handleUpdateAlert = () => {
    if (onUpdateAlert && editingAlert && alertForm.title.trim()) {
      onUpdateAlert(editingAlert.id, {
        ...alertForm,
        expiresAt: alertForm.expiresAt || undefined
      });
      setEditingAlert(null);
      setAlertForm({
        type: 'info',
        title: '',
        description: '',
        priority: 'medium',
        isActive: true,
        expiresAt: ''
      });
      setShowAlertModal(false);
    }
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      content: note.content,
      category: note.category,
      isPrivate: note.isPrivate
    });
    setShowNoteModal(true);
  };

  const openEditAlert = (alert: AlertFlag) => {
    setEditingAlert(alert);
    setAlertForm({
      type: alert.type,
      title: alert.title,
      description: alert.description,
      priority: alert.priority,
      isActive: alert.isActive,
      expiresAt: alert.expiresAt || ''
    });
    setShowAlertModal(true);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return HiExclamationTriangle;
      case 'danger': return HiXCircle;
      case 'success': return HiCheckCircle;
      default: return HiInformationCircle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'danger': return 'failure';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'failure';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'gray';
    }
  };

  if (isOwnProfile && userRole === 'member') {
    return (
      <Card>
        <div className="p-4 text-center text-gray-500">
          <HiEye className="mx-auto h-12 w-12 mb-2" />
          <p>Notes and alerts are only visible to staff members.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Alerts Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          {canManageAlerts && (
            <Button 
              size="sm" 
              onClick={() => setShowAlertModal(true)}
            >
              <HiPlus className="mr-1 h-4 w-4" />
              Add Alert
            </Button>
          )}
        </div>

        {/* Alert Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <TextInput
              icon={HiSearch}
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <Button
            color={showActiveAlertsOnly ? 'blue' : 'gray'}
            onClick={() => setShowActiveAlertsOnly(!showActiveAlertsOnly)}
          >
            <HiFilter className="mr-1 h-4 w-4" />
            Active Only
          </Button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HiInformationCircle className="mx-auto h-12 w-12 mb-2" />
              <p>No alerts found</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <Alert
                  key={alert.id}
                  color={getAlertColor(alert.type)}
                  icon={IconComponent}
                  additionalContent={
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge color={getPriorityColor(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          {!alert.isActive && (
                            <Badge color="gray">Inactive</Badge>
                          )}
                          {alert.expiresAt && (
                            <Badge color="yellow">
                              Expires: {new Date(alert.expiresAt).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        {canManageAlerts && (
                          <div className="flex gap-2">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => openEditAlert(alert)}
                            >
                              <HiPencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => onDeleteAlert?.(alert.id)}
                            >
                              <HiTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created by {alert.createdBy} on {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  }
                >
                  <h4 className="text-lg font-medium">{alert.title}</h4>
                </Alert>
              );
            })
          )}
        </div>
      </Card>

      {/* Notes Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
          {canManageNotes && (
            <Button 
              size="sm" 
              onClick={() => setShowNoteModal(true)}
            >
              <HiPlus className="mr-1 h-4 w-4" />
              Add Note
            </Button>
          )}
        </div>

        {/* Note Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <TextInput
              icon={HiSearch}
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="behavior">Behavior</option>
            <option value="medical">Medical</option>
            <option value="billing">Billing</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </Select>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HiInformationCircle className="mx-auto h-12 w-12 mb-2" />
              <p>No notes found</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge color="blue">{note.category}</Badge>
                    {note.isPrivate && (
                      <Badge color="gray">Private</Badge>
                    )}
                  </div>
                  {canManageNotes && (
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color="gray"
                        onClick={() => openEditNote(note)}
                      >
                        <HiPencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => onDeleteNote?.(note.id)}
                      >
                        <HiTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                <div className="mt-3 text-sm text-gray-500">
                  <p>Created by {note.createdBy} on {new Date(note.createdAt).toLocaleString()}</p>
                  {note.updatedAt && (
                    <p>Updated by {note.updatedBy} on {new Date(note.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Add/Edit Note Modal */}
      <Modal show={showNoteModal} onClose={() => {
        setShowNoteModal(false);
        setEditingNote(null);
        setNoteForm({ content: '', category: 'general', isPrivate: false });
      }}>
        <ModalHeader>
          {editingNote ? 'Edit Note' : 'Add New Note'}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={noteForm.category}
                onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value as any })}
              >
                <option value="general">General</option>
                <option value="behavior">Behavior</option>
                <option value="medical">Medical</option>
                <option value="billing">Billing</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Content
              </label>
              <Textarea
                rows={4}
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                placeholder="Enter note content..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={noteForm.isPrivate}
                onChange={(e) => setNoteForm({ ...noteForm, isPrivate: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700">
                Mark as private (visible only to admin)
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={editingNote ? handleUpdateNote : handleAddNote}>
            {editingNote ? 'Update Note' : 'Add Note'}
          </Button>
          <Button color="gray" onClick={() => {
            setShowNoteModal(false);
            setEditingNote(null);
            setNoteForm({ content: '', category: 'general', isPrivate: false });
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add/Edit Alert Modal */}
      <Modal show={showAlertModal} onClose={() => {
        setShowAlertModal(false);
        setEditingAlert(null);
        setAlertForm({
          type: 'info',
          title: '',
          description: '',
          priority: 'medium',
          isActive: true,
          expiresAt: ''
        });
      }}>
        <ModalHeader>
          {editingAlert ? 'Edit Alert' : 'Add New Alert'}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Type
                </label>
                <Select
                  value={alertForm.type}
                  onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value as any })}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Danger</option>
                  <option value="success">Success</option>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={alertForm.priority}
                  onChange={(e) => setAlertForm({ ...alertForm, priority: e.target.value as any })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Title
              </label>
              <TextInput
                value={alertForm.title}
                onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                placeholder="Enter alert title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                rows={3}
                value={alertForm.description}
                onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
                placeholder="Enter alert description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires At (Optional)
              </label>
              <TextInput
                type="datetime-local"
                value={alertForm.expiresAt}
                onChange={(e) => setAlertForm({ ...alertForm, expiresAt: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={alertForm.isActive}
                onChange={(e) => setAlertForm({ ...alertForm, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Alert is active
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={editingAlert ? handleUpdateAlert : handleAddAlert}>
            {editingAlert ? 'Update Alert' : 'Add Alert'}
          </Button>
          <Button color="gray" onClick={() => {
            setShowAlertModal(false);
            setEditingAlert(null);
            setAlertForm({
              type: 'info',
              title: '',
              description: '',
              priority: 'medium',
              isActive: true,
              expiresAt: ''
            });
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
