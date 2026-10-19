import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, Sparkles } from 'lucide-react';
import { parseCsv, formatBytes } from '@/utils/csv';
import type { ParsedCsvResult } from '@/types';

interface UploadZoneProps {
  onFileProcessed: (result: ParsedCsvResult, fileName: string, fileSize: number) => void;
}

interface ProcessedFile {
  name: string;
  size: number;
  rowCount: number;
  columnCount: number;
}

type UploadState = 'idle' | 'dragging' | 'processing' | 'done' | 'error';

export default function UploadZone({ onFileProcessed }: UploadZoneProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setErrorMsg('Please upload a .csv file');
        setState('error');
        return;
      }

      setState('processing');

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const result = parseCsv(text);
        if (result.rowCount === 0) {
          setErrorMsg('The CSV file appears to be empty');
          setState('error');
          return;
        }
        setProcessedFile({
          name: file.name,
          size: file.size,
          rowCount: result.rowCount,
          columnCount: result.headers.length,
        });
        setState('done');
        onFileProcessed(result, file.name, file.size);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read file');
        setState('error');
      };
      reader.readAsText(file);
    },
    [onFileProcessed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setState('idle');
    setProcessedFile(null);
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <UploadCloud className="h-4.5 w-4.5 text-primary-400" strokeWidth={1.8} />
            Upload Customer Data
          </h3>
          <p className="text-xs text-ink-400 mt-0.5">Drag & drop your CSV file to begin AI-powered analysis</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 px-3 py-1 text-[10px] font-semibold text-accent-400">
          <Sparkles className="h-3 w-3" />
          Auto-Clean Enabled
        </span>
      </div>

      <input ref={inputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

      {state === 'done' && processedFile ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/5 p-8 animate-fade-in">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/15 border border-primary-500/30">
              <FileText className="h-6 w-6 text-primary-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{processedFile.name}</p>
              <p className="text-xs text-ink-400 mt-0.5">
                {formatBytes(processedFile.size)} · {processedFile.rowCount.toLocaleString()} rows · {processedFile.columnCount} columns
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-400" strokeWidth={2} />
                <span className="text-xs text-primary-400 font-medium">AI cleaning complete — dashboard updated in real-time</span>
              </div>
            </div>
            <button
              onClick={reset}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      ) : state === 'error' ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-500/40 bg-red-500/5 p-8 cursor-pointer"
          onClick={reset}
        >
          <X className="h-8 w-8 text-red-400 mb-3" strokeWidth={1.8} />
          <p className="text-sm font-semibold text-red-400">{errorMsg}</p>
          <p className="text-xs text-ink-400 mt-1">Click to try again</p>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setState('dragging');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setState('idle');
          }}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 lg:p-12 cursor-pointer transition-all duration-300 ${
            state === 'dragging'
              ? 'border-primary-400 bg-primary-500/10 scale-[1.01]'
              : 'border-ink-600 bg-ink-850/40 hover:border-primary-500/50 hover:bg-primary-500/5'
          }`}
        >
          {state === 'processing' && (
            <div className="absolute inset-0 rounded-xl shimmer-bg animate-shimmer pointer-events-none" />
          )}

          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            state === 'dragging' ? 'bg-primary-500/20 scale-110' : 'bg-ink-700/60'
          } ${state === 'processing' ? 'animate-pulse' : ''}`}>
            <UploadCloud className={`h-8 w-8 transition-colors ${
              state === 'dragging' ? 'text-primary-400' : 'text-ink-300'
            }`} strokeWidth={1.5} />
          </div>

          <p className="mt-4 text-base font-semibold text-white">
            {state === 'processing' ? 'Processing your data...' : 'Drop your CSV file here'}
          </p>
          <p className="mt-1 text-sm text-ink-400">
            {state === 'processing' ? 'AI is cleaning and validating records' : 'or click to browse files'}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-md bg-ink-700/60 px-2.5 py-1 text-[11px] font-medium text-ink-300">CSV only</span>
            <span className="rounded-md bg-ink-700/60 px-2.5 py-1 text-[11px] font-medium text-ink-300">Max 50MB</span>
            <span className="rounded-md bg-ink-700/60 px-2.5 py-1 text-[11px] font-medium text-ink-300">Auto-dedup</span>
          </div>
        </div>
      )}
    </div>
  );
}
