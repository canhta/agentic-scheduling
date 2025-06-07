'use client';

import { Badge, Button } from 'flowbite-react';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { ReactNode } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  width?: string;
  render?: (value: unknown, record: T) => ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function StatusBadge({ 
  status, 
  activeText = 'Active', 
  inactiveText = 'Inactive' 
}: { 
  status: boolean; 
  activeText?: string; 
  inactiveText?: string; 
}) {
  return (
    <Badge color={status ? 'success' : 'failure'} size="sm">
      {status ? activeText : inactiveText}
    </Badge>
  );
}

export function DataTable<T extends Record<string, unknown> & { id: string | number }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  loading = false,
  emptyMessage = "No data available",
  className = ""
}: DataTableProps<T>) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4">
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4">
                  <div className="text-center py-4 text-gray-500">
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(record[column.key], record)
                        : String(record[column.key] || '')
                      }
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {onEdit && (
                          <Button
                            size="xs"
                            color="blue"
                            onClick={() => onEdit(record)}
                          >
                            <HiPencil className="h-3 w-3" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => onDelete(record)}
                          >
                            <HiTrash className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}