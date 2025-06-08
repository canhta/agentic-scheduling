'use client';

import { Badge, Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
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
        <Table>
          <TableHead>
            {columns.map((column) => (
              <TableHeadCell 
                key={column.key} 
                style={{ width: column.width }}
              >
                {column.title}
              </TableHeadCell>
            ))}
            {(onEdit || onDelete) && (
              <TableHeadCell>
                Actions
              </TableHeadCell>
            )}
          </TableHead>
          <TableBody className="divide-y">
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                  <div className="text-center py-4 text-gray-500">
                    {emptyMessage}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="whitespace-nowrap">
                      {column.render 
                        ? column.render(record[column.key], record)
                        : String(record[column.key] || '')
                      }
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="whitespace-nowrap text-sm font-medium">
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
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}