'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, TextInput, Select, Modal, Alert, ToggleSwitch, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { 
  HiKey, 
  HiDevicePhoneMobile, 
  HiEye, 
  HiEyeSlash,
  HiClock,
  HiComputerDesktop,
  HiGlobeAlt,
  HiExclamationTriangle,
  HiCheckCircle,
  HiQrCode,
  HiLockClosed
} from 'react-icons/hi2';
import { HiShieldCheck } from 'react-icons/hi';
import Image from 'next/image';

interface LoginSession {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ipAddress: string;
  loginAt: string;
  lastActivity: string;
  isCurrentSession: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'failed_login' | 'account_locked' | 'recovery' | '2fa_enabled' | '2fa_disabled';
  description: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  success: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number; // in minutes
  requirePasswordChange: boolean;
  passwordLastChanged: string;
  accountLocked: boolean;
  failedLoginAttempts: number;
  maxFailedAttempts: number;
}

interface SecuritySectionProps {
  memberId: string;
  isOwnProfile: boolean;
  userRole: 'member' | 'admin' | 'staff';
  securitySettings: SecuritySettings;
  loginSessions: LoginSession[];
  securityEvents: SecurityEvent[];
  onUpdateSecuritySettings?: (settings: Partial<SecuritySettings>) => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onTerminateSession?: (sessionId: string) => void;
  onTerminateAllSessions?: () => void;
  onEnableTwoFactor?: () => void;
  onDisableTwoFactor?: (password: string) => void;
  onUnlockAccount?: () => void;
}

export default function SecuritySection({
  memberId,
  isOwnProfile,
  userRole,
  securitySettings,
  loginSessions,
  securityEvents,
  onUpdateSecuritySettings,
  onChangePassword,
  onTerminateSession,
  onTerminateAllSessions,
  onEnableTwoFactor,
  onDisableTwoFactor,
  onUnlockAccount
}: SecuritySectionProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showDisableTwoFactorModal, setShowDisableTwoFactorModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [disableTwoFactorPassword, setDisableTwoFactorPassword] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const canManageSecurity = isOwnProfile || userRole === 'admin';
  const canViewSessions = isOwnProfile || userRole === 'admin' || userRole === 'staff';
  const canViewEvents = userRole === 'admin' || userRole === 'staff';

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (onChangePassword) {
      onChangePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    }
  };

  const handleEnableTwoFactor = () => {
    // In a real app, this would generate a QR code
    setQrCodeUrl('https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=otpauth://totp/GymApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GymApp');
    if (onEnableTwoFactor) {
      onEnableTwoFactor();
    }
  };

  const handleDisableTwoFactor = () => {
    if (onDisableTwoFactor) {
      onDisableTwoFactor(disableTwoFactorPassword);
      setDisableTwoFactorPassword('');
      setShowDisableTwoFactorModal(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return HiDevicePhoneMobile;
      case 'tablet': return HiDevicePhoneMobile;
      default: return HiComputerDesktop;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return HiCheckCircle;
      case 'password_change': return HiKey;
      case 'failed_login': return HiExclamationTriangle;
      case 'account_locked': return HiLockClosed;
      case '2fa_enabled': 
      case '2fa_disabled': return HiShieldCheck;
      default: return HiClock;
    }
  };

  const getEventColor = (type: string, success: boolean) => {
    if (!success) return 'failure';
    switch (type) {
      case 'login': return 'success';
      case 'password_change': return 'info';
      case 'failed_login': return 'failure';
      case 'account_locked': return 'failure';
      case '2fa_enabled': return 'success';
      case '2fa_disabled': return 'warning';
      default: return 'gray';
    }
  };

  const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) return { label: 'Weak', color: 'failure' };
    if (score < 4) return { label: 'Medium', color: 'warning' };
    return { label: 'Strong', color: 'success' };
  };

  if (!canManageSecurity && !canViewSessions && !canViewEvents) {
    return (
      <Card>
        <div className="p-4 text-center text-gray-500">
          <HiShieldCheck className="mx-auto h-12 w-12 mb-2" />
          <p>{`You don't have permission to view security settings.`}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
        
        {securitySettings.accountLocked && (
          <Alert color="failure" icon={HiLockClosed} className="mb-4">
            <span className="font-medium">Account Locked!</span> This account has been locked due to too many failed login attempts.
            {userRole === 'admin' && (
              <div className="mt-2">
                <Button size="sm" color="failure" onClick={onUnlockAccount}>
                  Unlock Account
                </Button>
              </div>
            )}
          </Alert>
        )}

        {securitySettings.requirePasswordChange && (
          <Alert color="warning" icon={HiExclamationTriangle} className="mb-4">
            <span className="font-medium">Password Change Required!</span> Please change your password for security reasons.
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Two-Factor Authentication</p>
                <p className="font-semibold">
                  {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <HiShieldCheck className={`h-8 w-8 ${securitySettings.twoFactorEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Password Last Changed</p>
                <p className="font-semibold">
                  {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                </p>
              </div>
              <HiKey className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Login Attempts</p>
                <p className="font-semibold">
                  {securitySettings.failedLoginAttempts} / {securitySettings.maxFailedAttempts}
                </p>
              </div>
              <HiExclamationTriangle className={`h-8 w-8 ${
                securitySettings.failedLoginAttempts > 0 ? 'text-yellow-500' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      {canManageSecurity && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          
          <div className="space-y-4">
            {/* Password Management */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-600">
                  Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                </p>
              </div>
              <Button onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={securitySettings.twoFactorEnabled ? 'success' : 'gray'}>
                  {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                {securitySettings.twoFactorEnabled ? (
                  <Button 
                    color="failure" 
                    size="sm"
                    onClick={() => setShowDisableTwoFactorModal(true)}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => setShowTwoFactorModal(true)}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>

            {/* Login Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Login Notifications</h4>
                <p className="text-sm text-gray-600">
                  Get notified when someone logs into your account
                </p>
              </div>
              <ToggleSwitch
                checked={securitySettings.loginNotifications}
                onChange={(checked) => onUpdateSecuritySettings?.({ loginNotifications: checked })}
              />
            </div>

            {/* Session Timeout */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Session Timeout</h4>
                <p className="text-sm text-gray-600">
                  Automatically log out after period of inactivity
                </p>
              </div>
              <Select
                value={securitySettings.sessionTimeout}
                onChange={(e) => onUpdateSecuritySettings?.({ sessionTimeout: parseInt(e.target.value) })}
                className="w-32"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Active Sessions */}
      {canViewSessions && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
            {isOwnProfile && loginSessions.length > 1 && (
              <Button color="failure" size="sm" onClick={onTerminateAllSessions}>
                Terminate All Other Sessions
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {loginSessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              return (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DeviceIcon className="h-6 w-6 text-gray-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{session.browser}</p>
                        {session.isCurrentSession && (
                          <Badge color="success">Current Session</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        <HiGlobeAlt className="inline h-4 w-4 mr-1" />
                        {session.location} • {session.ipAddress}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last activity: {new Date(session.lastActivity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrentSession && isOwnProfile && (
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => onTerminateSession?.(session.id)}
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Security Events */}
      {canViewEvents && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
          
          <div className="space-y-3">
            {securityEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <HiClock className="mx-auto h-12 w-12 mb-2" />
                <p>No recent security events</p>
              </div>
            ) : (
              securityEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                const eventColor = getEventColor(event.type, event.success);
                
                return (
                  <div key={event.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <EventIcon className={`h-5 w-5 mt-0.5 ${
                      eventColor === 'success' ? 'text-green-500' :
                      eventColor === 'failure' ? 'text-red-500' :
                      eventColor === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()} • {event.location} • {event.ipAddress}
                      </p>
                    </div>
                    <Badge color={eventColor}>
                      {event.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onClose={() => {
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordFields({ current: false, new: false, confirm: false });
      }}>
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <TextInput
                  type={showPasswordFields.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswordFields({ ...showPasswordFields, current: !showPasswordFields.current })}
                >
                  {showPasswordFields.current ? (
                    <HiEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <TextInput
                  type={showPasswordFields.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswordFields({ ...showPasswordFields, new: !showPasswordFields.new })}
                >
                  {showPasswordFields.new ? (
                    <HiEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordForm.newPassword && (
                <div className="mt-2">
                  <Badge color={passwordStrength(passwordForm.newPassword).color}>
                    Password Strength: {passwordStrength(passwordForm.newPassword).label}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <TextInput
                  type={showPasswordFields.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswordFields({ ...showPasswordFields, confirm: !showPasswordFields.confirm })}
                >
                  {showPasswordFields.confirm ? (
                    <HiEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <Alert color="info">
              <p className="text-sm">
                Your password should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.
              </p>
            </Alert>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            onClick={handleChangePassword}
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Change Password
          </Button>
          <Button color="gray" onClick={() => {
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordFields({ current: false, new: false, confirm: false });
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Enable Two-Factor Modal */}
      <Modal show={showTwoFactorModal} onClose={() => setShowTwoFactorModal(false)}>
        <ModalHeader>Enable Two-Factor Authentication</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="text-center">
              <HiQrCode className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Scan QR Code with your authenticator app
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Use Google Authenticator, Authy, or any compatible TOTP app to scan this QR code.
              </p>
              {qrCodeUrl && (
                <Image src={qrCodeUrl} alt="QR Code" className="mx-auto border border-gray-300 rounded" />
              )}
            </div>
            
            <Alert color="info">
              <p className="text-sm">
                After scanning the QR code, enter the 6-digit code from your authenticator app to verify the setup.
              </p>
            </Alert>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <TextInput
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => {
            handleEnableTwoFactor();
            setShowTwoFactorModal(false);
          }}>
            Enable Two-Factor Authentication
          </Button>
          <Button color="gray" onClick={() => setShowTwoFactorModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Disable Two-Factor Modal */}
      <Modal show={showDisableTwoFactorModal} onClose={() => {
        setShowDisableTwoFactorModal(false);
        setDisableTwoFactorPassword('');
      }}>
        <ModalHeader>Disable Two-Factor Authentication</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Alert color="warning">
              <p className="text-sm">
                <strong>Warning:</strong> Disabling two-factor authentication will make your account less secure. 
                Are you sure you want to continue?
              </p>
            </Alert>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <TextInput
                type="password"
                value={disableTwoFactorPassword}
                onChange={(e) => setDisableTwoFactorPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="failure"
            onClick={handleDisableTwoFactor}
            disabled={!disableTwoFactorPassword}
          >
            Disable Two-Factor Authentication
          </Button>
          <Button color="gray" onClick={() => {
            setShowDisableTwoFactorModal(false);
            setDisableTwoFactorPassword('');
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
