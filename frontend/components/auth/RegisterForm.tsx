'use client';

import React, { useState } from 'react';
import { Button, Card, Label, TextInput, Alert, Spinner, Select } from 'flowbite-react';
import { HiEye, HiEyeOff, HiMail, HiUser, HiExclamationCircle, HiOfficeBuilding } from 'react-icons/hi';
import { useAuth } from '../../lib/auth/auth-context';
import { UserRole, type RegisterDto } from '../../lib/types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  redirectTo?: string;
  defaultOrganizationId?: string;
  defaultRole?: UserRole;
  showRoleSelection?: boolean;
  organizationOptions?: Array<{ id: string; name: string }>;
}

export function RegisterForm({ 
  onSuccess, 
  onSwitchToLogin,
  redirectTo,
  defaultOrganizationId,
  defaultRole = UserRole.MEMBER,
  showRoleSelection = false,
  organizationOptions = []
}: RegisterFormProps) {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterDto>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationId: defaultOrganizationId || '',
    role: defaultRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.organizationId) {
      errors.organizationId = 'Please select an organization';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await register(formData);
      
      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        window.location.href = redirectTo;
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Error is handled by the auth context
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email && 
                     formData.firstName && 
                     formData.lastName && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.organizationId &&
                     formData.password === formData.confirmPassword;

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Join us today! Create your account to get started.
          </p>
        </div>

        {error && (
          <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
            <span className="font-medium">Registration failed!</span> {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <TextInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                icon={HiUser}
                color={validationErrors.firstName ? 'failure' : undefined}
              />
              {validationErrors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.firstName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last name</Label>
              <TextInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                icon={HiUser}
                color={validationErrors.lastName ? 'failure' : undefined}
              />
              {validationErrors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              icon={HiMail}
              color={validationErrors.email ? 'failure' : undefined}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.email}
              </p>
            )}
          </div>

          {organizationOptions.length > 0 && (
            <div>
              <Label htmlFor="organizationId">Organization</Label>
              <Select
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                color={validationErrors.organizationId ? 'failure' : undefined}
              >
                <option value="">Select an organization</option>
                {organizationOptions.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </Select>
              {validationErrors.organizationId && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.organizationId}
                </p>
              )}
            </div>
          )}

          {showRoleSelection && (
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                <option value={UserRole.MEMBER}>Member</option>
                <option value={UserRole.STAFF}>Staff</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <TextInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                color={validationErrors.password ? 'failure' : undefined}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.password}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                color={validationErrors.confirmPassword ? 'failure' : undefined}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              required
              disabled={isSubmitting}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                disabled={isSubmitting}
              >
                Sign in here
              </button>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
