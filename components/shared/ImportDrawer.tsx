'use client';

import React, { useState } from 'react';
import { RightDrawer } from '@/components/shared/RightDrawer';
import { Upload, FileSpreadsheet, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { DataTable } from '@/components/shared/DataTable';

interface ImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  expectedColumns: string[];
  onImport: (data: Record<string, unknown>[]) => Promise<void>;
}

export function ImportDrawer({ isOpen, onClose, title, expectedColumns, onImport }: ImportDrawerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

        if (jsonData.length < 2) {
          throw new Error("File contains no data or only headers.");
        }

        const headers = jsonData[0] as string[];
        const missingColumns = expectedColumns.filter(c => !headers.includes(c));
        
        if (missingColumns.length > 0) {
          setErrors([`Missing required columns: ${missingColumns.join(', ')}`]);
          setPreviewData([]);
          return;
        }

        // Convert to object format
        const rows = jsonData.slice(1).map(row => {
          const obj: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        }).filter(row => Object.keys(row).some(k => row[k] !== undefined && row[k] !== '')); // remove empty rows

        setErrors([]);
        setPreviewData(rows);
      } catch (err: unknown) {
        setErrors([`Error processing file: ${(err as Error).message}`]);
        setPreviewData([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;
    setIsImporting(true);
    try {
      await onImport(previewData);
      setIsSuccess(true);
      toast.success("Import successful");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: unknown) {
      toast.error(`Import failed: ${(error as Error).message}`);
      setErrors([`Import failed: ${(error as Error).message}`]);
    } finally {
      setIsImporting(false);
    }
  };

  const previewColumns = expectedColumns.map(col => ({
    key: col,
    header: col,
    cell: (item: Record<string, unknown>) => (item[col] as string) || '-'
  }));

  return (
    <RightDrawer isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
        {!isSuccess ? (
          <>
            <div className="bg-aurum-cream-secondary border-2 border-dashed border-aurum-gold-primary/30 rounded-xl p-8 text-center transition-colors hover:bg-aurum-cream-primary hover:border-aurum-gold-primary">
              <input
                type="file"
                id="file-upload"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <FileSpreadsheet className="w-12 h-12 text-aurum-gold-primary mb-4" />
                <span className="text-aurum-text-heading font-medium text-lg mb-2">
                  {file ? file.name : 'Click to upload CSV or Excel file'}
                </span>
                <span className="text-aurum-text-body/60 text-sm">
                  Required columns: {expectedColumns.join(', ')}
                </span>
              </label>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <XCircle className="w-5 h-5" />
                  Validation Errors
                </div>
                <ul className="list-disc list-inside text-sm pl-2">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {previewData.length > 0 && errors.length === 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg text-aurum-text-heading">Preview ({previewData.length} rows)</h3>
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md text-sm border border-yellow-200">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Dry Run Passed</span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto rounded-lg border border-aurum-gold-primary/20">
                  <DataTable
                    data={previewData.slice(0, 5).map((row: Record<string, unknown>, i: number) => ({ ...row, _key: i.toString() }))} // Show only first 5 for preview
                    columns={previewColumns}
                    keyExtractor={(item: Record<string, unknown>) => item._key as string}
                  />
                </div>
                {previewData.length > 5 && (
                  <p className="text-sm text-aurum-text-body/60 text-center italic">
                    Showing first 5 rows...
                  </p>
                )}

                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-aurum-charcoal text-white py-3 rounded-lg font-medium hover:bg-aurum-charcoal/90 transition-colors disabled:opacity-50"
                >
                  {isImporting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import {previewData.length} records
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-playfair text-aurum-text-heading mb-2">Import Successful</h3>
            <p className="text-aurum-text-body/80">
              Successfully imported {previewData.length} records.
            </p>
          </div>
        )}
      </div>
    </RightDrawer>
  );
}
