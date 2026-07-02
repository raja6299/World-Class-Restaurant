'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string | React.ReactNode;
  cell: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyStateMessage?: string;
  emptyStateAction?: React.ReactNode;
  
  // Pagination
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  
  // Search
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  
  // Export
  exportData?: unknown[];
  exportFilename?: string;
}

import { exportToCSV, exportToExcel } from '@/src/lib/export';
import { Download } from 'lucide-react';

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyStateMessage = 'No data found',
  emptyStateAction,
  pageCount,
  currentPage,
  onPageChange,
  searchPlaceholder,
  onSearch,
  searchValue,
  exportData,
  exportFilename = 'export',
}: DataTableProps<T>) {

  const handleExportCSV = () => {
    if (exportData) exportToCSV(exportData, exportFilename);
  };

  const handleExportExcel = () => {
    if (exportData) exportToExcel(exportData, exportFilename);
  };

  return (
    <div className="flex flex-col w-full bg-aurum-cream-primary rounded-xl border border-aurum-gold-primary/20 shadow-aurum-sm overflow-hidden">
      
      {/* Table Toolbar (Search / Filters / Export) */}
      {(onSearch || searchPlaceholder || exportData) && (
        <div className="p-4 border-b border-aurum-gold-primary/10 bg-aurum-cream-secondary flex items-center justify-between gap-4">
          
          <div className="relative w-full max-w-md">
            {onSearch && (
              <>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurum-gold-earthy/50" />
                <input
                  type="text"
                  placeholder={searchPlaceholder || 'Search...'}
                  value={searchValue || ''}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-aurum-cream-primary border border-aurum-gold-primary/20 rounded-lg text-sm text-aurum-text-body focus:outline-none focus:border-aurum-gold-primary focus:ring-1 focus:ring-aurum-gold-primary transition-colors"
                />
              </>
            )}
          </div>

          {exportData && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-white text-aurum-text-heading border border-gray-200 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 bg-white text-aurum-text-heading border border-gray-200 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Excel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-aurum-charcoal-primary text-aurum-cream-primary border-b border-aurum-gold-primary/20">
              {columns.map((col, index) => (
                <th
                  key={col.key || index}
                  className={`px-6 py-4 text-sm font-semibold tracking-wider whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aurum-gold-primary/10">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={`skeleton-col-${j}`} className="px-6 py-4">
                      <div className="h-4 bg-aurum-gold-primary/10 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-aurum-text-body/50 text-lg font-playfair mb-4">{emptyStateMessage}</p>
                    {emptyStateAction}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-aurum-gold-primary/5 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${keyExtractor(item)}-${col.key || colIndex}`}
                      className={`px-6 py-4 text-sm text-aurum-text-body ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.cell(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pageCount !== undefined && pageCount > 1 && onPageChange && currentPage && (
        <div className="px-6 py-4 border-t border-aurum-gold-primary/10 bg-aurum-cream-secondary flex items-center justify-between">
          <span className="text-sm text-aurum-text-body/60">
            Page <span className="font-medium text-aurum-text-heading">{currentPage}</span> of{' '}
            <span className="font-medium text-aurum-text-heading">{pageCount}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-aurum-gold-primary/20 text-aurum-text-body hover:bg-aurum-gold-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= pageCount}
              className="p-2 rounded-lg border border-aurum-gold-primary/20 text-aurum-text-body hover:bg-aurum-gold-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
