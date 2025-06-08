'use client';

import React, { useState } from 'react';
import { Button, Card, Label, TextInput, Alert, Spinner, HelperText } from 'flowbite-react';
import { HiMail, HiExclamationCircle, HiCheckCircle, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../lib/auth/auth-context';

interface ForgotPasswordFormProps {
    onSuccess?: () => void;
    onBack?: () => void;
}

export function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
    const { forgotPassword, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');
        clearError();

        try {
            const message = await forgotPassword(email);
            setSuccessMessage(message);

            if (onSuccess) {
                setTimeout(onSuccess, 2000);
            }
        } catch (error) {
            console.error('Password reset request failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = email && /\S+@\S+\.\S+/.test(email);

    return (
        <Card className="w-full max-w-md mx-auto">
            <div className="p-6">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {`Enter your email address and we'll send you a link to reset your password.`}
                    </p>
                </div>

                {error && (
                    <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                        <span className="font-medium">Error!</span> {error.message}
                    </Alert>
                )}

                {successMessage && (
                    <Alert color="success" icon={HiCheckCircle} className="mb-4">
                        <span className="font-medium">Success!</span> {successMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email" title="Email address" />
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) clearError();
                                if (successMessage) setSuccessMessage('');
                            }}
                            required
                            disabled={isSubmitting || !!successMessage}
                            icon={HiMail}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!isFormValid || isSubmitting || !!successMessage}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Sending reset link...
                            </>
                        ) : successMessage ? (
                            'Reset link sent!'
                        ) : (
                            'Send reset link'
                        )}
                    </Button>
                </form>

                {onBack && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            disabled={isSubmitting}
                        >
                            ← Back to sign in
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}

interface ResetPasswordFormProps {
    token: string;
    onSuccess?: () => void;
    onBack?: () => void;
}

export function ResetPasswordForm({ token, onSuccess, onBack }: ResetPasswordFormProps) {
    const { resetPassword, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        newPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation errors for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (error) clearError();
        if (successMessage) setSuccessMessage('');
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.newPassword) {
            errors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters long';
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
        clearError();

        try {
            const message = await resetPassword(token, formData.newPassword);
            setSuccessMessage(message);

            if (onSuccess) {
                setTimeout(onSuccess, 2000);
            }
        } catch (error) {
            console.error('Password reset failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.newPassword && formData.newPassword.length >= 8;

    return (
        <Card className="w-full max-w-md mx-auto">
            <div className="p-6">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Enter your new password below.
                    </p>
                </div>

                {error && (
                    <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
                        <span className="font-medium">Error!</span> {error.message}
                    </Alert>
                )}

                {successMessage && (
                    <Alert color="success" icon={HiCheckCircle} className="mb-4">
                        <span className="font-medium">Success!</span> {successMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="newPassword" title="New password" />
                        <div className="relative">
                            <TextInput
                                id="newPassword"
                                name="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting || !!successMessage}
                                color={validationErrors.newPassword ? 'failure' : undefined}
                            />
                            {validationErrors.newPassword && (
                                <HelperText color="failure">
                                    {validationErrors.newPassword}
                                </HelperText>
                            )}
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting || !!successMessage}
                            >
                                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                    </div>


                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!isFormValid || isSubmitting || !!successMessage}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Resetting password...
                            </>
                        ) : successMessage ? (
                            'Password reset!'
                        ) : (
                            'Reset password'
                        )}
                    </Button>
                </form>

                {onBack && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            disabled={isSubmitting}
                        >
                            ← Back to sign in
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
}
