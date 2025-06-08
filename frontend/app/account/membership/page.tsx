'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Progress, Alert } from 'flowbite-react';
import { HiCreditCard, HiCalendar, HiClock, HiTrendingUp, HiGift, HiInformationCircle, HiDownload, HiX } from 'react-icons/hi';

interface MembershipPlan {
  id: string;
  name: string;
  type: 'unlimited' | 'credit-based' | 'class-pack';
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  popular?: boolean;
}

interface Membership {
  id: string;
  plan: MembershipPlan;
  status: 'active' | 'cancelled' | 'paused' | 'expired';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  credits: {
    current: number;
    total: number;
    expiryDate?: string;
  };
  autoRenewal: boolean;
  discounts: Array<{
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    expiryDate: string;
  }>;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
}

const mockMembership: Membership = {
  id: '1',
  plan: {
    id: 'premium',
    name: 'Premium Membership',
    type: 'credit-based',
    price: 199,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      '20 class credits per month',
      'Access to all studios',
      'Priority booking',
      'Guest passes (2 per month)',
      'Personal training discount',
      'Nutrition consultation'
    ]
  },
  status: 'active',
  startDate: '2024-01-01',
  nextBillingDate: '2024-02-01',
  credits: {
    current: 12,
    total: 20,
    expiryDate: '2024-02-01'
  },
  autoRenewal: true,
  discounts: [
    {
      id: '1',
      name: 'Annual Membership Discount',
      type: 'percentage',
      value: 15,
      expiryDate: '2024-12-31'
    }
  ]
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-01',
    description: 'Premium Membership - January 2024',
    amount: 199,
    currency: 'USD',
    status: 'completed',
    invoiceUrl: '/invoices/invoice-001.pdf'
  },
  {
    id: '2',
    date: '2023-12-01',
    description: 'Premium Membership - December 2023',
    amount: 199,
    currency: 'USD',
    status: 'completed',
    invoiceUrl: '/invoices/invoice-002.pdf'
  },
  {
    id: '3',
    date: '2023-11-01',
    description: 'Premium Membership - November 2023',
    amount: 199,
    currency: 'USD',
    status: 'completed',
    invoiceUrl: '/invoices/invoice-003.pdf'
  }
];

const availablePlans: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Basic Membership',
    type: 'credit-based',
    price: 99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      '8 class credits per month',
      'Access to main studio',
      'Online booking',
      'Mobile app access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    type: 'credit-based',
    price: 199,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      '20 class credits per month',
      'Access to all studios',
      'Priority booking',
      'Guest passes (2 per month)',
      'Personal training discount',
      'Nutrition consultation'
    ],
    popular: true
  },
  {
    id: 'unlimited',
    name: 'Unlimited Membership',
    type: 'unlimited',
    price: 299,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      'Unlimited classes',
      'Access to all studios',
      'Priority booking',
      'Guest passes (4 per month)',
      'Personal training discount',
      'Nutrition consultation',
      'Wellness workshops'
    ]
  }
];

export default function MembershipPage() {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [activeTab, setActiveTab] = useState('current');

  const getStatusBadge = (status: Membership['status']) => {
    const statusConfig = {
      active: { color: 'success', text: 'Active' },
      cancelled: { color: 'failure', text: 'Cancelled' },
      paused: { color: 'warning', text: 'Paused' },
      expired: { color: 'failure', text: 'Expired' }
    };
    
    const config = statusConfig[status];
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const creditsUsedPercentage = (mockMembership.credits.total - mockMembership.credits.current) / mockMembership.credits.total * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Membership</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your membership, view usage, and billing information
          </p>
        </div>
      </div>

      {/* Current Membership Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Status */}
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {mockMembership.plan.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {formatCurrency(mockMembership.plan.price, mockMembership.plan.currency)}/month
              </p>
            </div>
            {getStatusBadge(mockMembership.status)}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
              <span className="text-gray-900 dark:text-white">
                {formatDate(mockMembership.startDate)}
              </span>
            </div>
            {mockMembership.nextBillingDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next Billing:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(mockMembership.nextBillingDate)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Auto Renewal:</span>
              <span className="text-gray-900 dark:text-white">
                {mockMembership.autoRenewal ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </Card>

        {/* Credits Usage */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <HiCreditCard className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Credits</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Used this month</span>
                <span className="text-gray-900 dark:text-white">
                  {mockMembership.credits.total - mockMembership.credits.current} / {mockMembership.credits.total}
                </span>
              </div>
              <Progress progress={creditsUsedPercentage} color="blue" size="md" />
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockMembership.credits.current}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Credits Remaining
              </div>
            </div>

            {mockMembership.credits.expiryDate && (
              <div className="text-center text-sm text-orange-600 dark:text-orange-400">
                Credits expire on {formatDate(mockMembership.credits.expiryDate)}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <Button
              color="blue"
              className="w-full"
              onClick={() => setShowChangeModal(true)}
            >
              <HiTrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            
            <Button
              color="gray"
              className="w-full"
            >
              <HiGift className="w-4 h-4 mr-2" />
              Buy Additional Credits
            </Button>
            
            <Button
              color="gray"
              className="w-full"
            >
              <HiCalendar className="w-4 h-4 mr-2" />
              Pause Membership
            </Button>
            
            <Button
              color="failure"
              className="w-full"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Membership
            </Button>
          </div>
        </Card>
      </div>

      {/* Active Discounts */}
      {mockMembership.discounts.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Discounts
          </h3>
          
          <div className="space-y-3">
            {mockMembership.discounts.map((discount) => (
              <Alert key={discount.id} color="success">
                <HiInformationCircle className="h-4 w-4" />
                <span className="ml-3 text-sm font-medium">
                  {discount.name}: {discount.value}
                  {discount.type === 'percentage' ? '%' : discount.type === 'fixed' ? ' USD' : ''} off
                </span>
                <span className="ml-auto text-xs text-green-600">
                  Expires {formatDate(discount.expiryDate)}
                </span>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Billing History
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4">{transaction.description}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={transaction.status === 'completed' ? 'success' : 'warning'}>
                      {transaction.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {transaction.invoiceUrl && (
                      <Button size="xs" color="gray">
                        <HiDownload className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Change Plan Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowChangeModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                    Change Membership Plan
                  </h3>
                  <button
                    onClick={() => setShowChangeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {availablePlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedPlan?.id === plan.id
                          ? 'ring-2 ring-blue-500 shadow-lg'
                          : 'hover:shadow-md'
                      } ${plan.popular ? 'border-blue-500' : ''}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge color="info">Most Popular</Badge>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                          {formatCurrency(plan.price, plan.currency)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          per {plan.billingCycle}
                        </div>
                      </div>
                      
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.id === mockMembership.plan.id && (
                        <div className="mt-4 text-center">
                          <Badge color="success">Current Plan</Badge>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  color="blue"
                  disabled={!selectedPlan || selectedPlan.id === mockMembership.plan.id}
                  className="mr-3"
                >
                  Change to {selectedPlan?.name}
                </Button>
                <Button color="gray" onClick={() => setShowChangeModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Membership Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowCancelModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                    Cancel Membership
                  </h3>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="text-center">
                  <HiInformationCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to cancel your membership?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your membership will remain active until {mockMembership.nextBillingDate && formatDate(mockMembership.nextBillingDate)}.
                    You&apos;ll lose access to all membership benefits after this date.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button color="failure" className="mr-3">
                  Yes, Cancel Membership
                </Button>
                <Button color="gray" onClick={() => setShowCancelModal(false)}>
                  Keep Membership
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
