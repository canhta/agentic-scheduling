'use client';

import { HiMenu, HiBell, HiSearch, HiUser } from 'react-icons/hi';
import { Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, TextInput } from 'flowbite-react';

interface AdminHeaderProps {
    onSidebarToggle: () => void;
}

export default function AdminHeader({ onSidebarToggle }: AdminHeaderProps) {
    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button
                            onClick={onSidebarToggle}
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <HiMenu className="w-6 h-6" />
                        </button>
                        <a href="/admin" className="flex ml-2 md:mr-24">
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                Agentic Scheduling
                            </span>
                        </a>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
                            {/* Search */}
                            <div className="relative hidden md:block mr-3">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <TextInput
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10"
                                    sizing="sm"
                                />
                            </div>

                            {/* Notifications */}
                            <Button color="gray" size="sm" className="mr-3">
                                <HiBell className="w-4 h-4" />
                            </Button>

                            {/* User dropdown */}
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <HiUser className="w-4 h-4 text-gray-600" />
                                    </div>
                                }
                            >
                                <DropdownHeader>
                                    <span className="block text-sm">Admin User</span>
                                    <span className="block truncate text-sm font-medium">admin@example.com</span>
                                </DropdownHeader>
                                <DropdownItem>Dashboard</DropdownItem>
                                <DropdownItem>Settings</DropdownItem>
                                <DropdownDivider />
                                <DropdownItem>Sign out</DropdownItem>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
