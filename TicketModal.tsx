import { useState, useRef, useEffect } from 'react';
import { X, Paperclip, Send, AlertCircle, CheckCircle2, Mail, ChevronDown } from 'lucide-react';

const SUPPORT_EMAIL = 'aurapredictai@gmail.com';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
}

const issueTypes = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'data', label: 'Data Pipeline Issue' },
  { value: 'account', label: 'Account & Billing' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

export default function TicketModal({ open, onClose }: TicketModalProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState('bug');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSubject('');
      setDescription('');
      setIssueType('bug');
      setFileName(null);
      setFileSize(0);
      setSubmitted(false);
      setErrors({});
      setTypeDropdownOpen(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setFileSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    else if (subject.trim().length < 5) newErrors.subject = 'Subject must be at least 5 characters';
    if (!description.trim()) newErrors.description = 'Description is required';
    else if (description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleEmailRedirect = () => {
    const selectedType = issueTypes.find((t) => t.value === issueType)?.label ?? 'Support';
    const mailtoSubject = encodeURIComponent(`[AuraPredict.AI] ${selectedType}: ${subject}`);
    const mailtoBody = encodeURIComponent(
      `Issue Type: ${selectedType}\nSubject: ${subject}\n\nDescription:\n${description}\n\n${fileName ? `Attachment: ${fileName} (${formatBytes(fileSize)})\n` : ''}Sent from AuraPredict.AI Dashboard`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  const selectedTypeLabel = issueTypes.find((t) => t.value === issueType)?.label ?? 'Select type';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(8, 9, 14, 0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="glass-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ background: 'linear-gradient(145deg, rgba(15, 17, 27, 0.98), rgba(11, 13, 20, 0.98))', border: '1px solid rgba(40, 45, 63, 0.8)' }}
      >
        {submitted ? (
          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/15 border border-primary-500/30 mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary-400" strokeWidth={1.6} />
                <div className="absolute -inset-1 rounded-2xl bg-primary-500/10 blur-xl -z-10" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ticket Submitted</h3>
              <p className="text-sm text-ink-400 max-w-sm mb-6">
                Your support ticket has been created. Click below to send it via email to our support team, or close this dialog — your ticket details are saved.
              </p>

              <div className="w-full rounded-xl border border-ink-700/60 bg-ink-850/60 p-4 mb-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20">
                    <Mail className="h-5 w-5 text-primary-400" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Sending to</p>
                    <p className="text-sm font-medium text-ink-100 truncate">{SUPPORT_EMAIL}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={handleEmailRedirect}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                  Open in Email
                </button>
                <button
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-ink-300 hover:text-ink-100 hover:border-ink-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-ink-700/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Raise a Support Ticket</h3>
                  <p className="text-xs text-ink-400 mt-0.5">We'll route this to {SUPPORT_EMAIL}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X className="h-4.5 w-4.5" strokeWidth={1.8} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-ink-100 block mb-2">Issue Type</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-ink-700/60 bg-ink-850/60 px-3.5 py-2.5 text-sm text-ink-100 hover:border-ink-600 transition-colors"
                  >
                    <span>{selectedTypeLabel}</span>
                    <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} />
                  </button>
                  {typeDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setTypeDropdownOpen(false)} />
                      <div className="absolute z-20 mt-1 w-full rounded-lg border border-ink-600 bg-ink-800 shadow-xl overflow-hidden animate-fade-in">
                        {issueTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              setIssueType(type.value);
                              setTypeDropdownOpen(false);
                            }}
                            className={`flex w-full items-center px-3.5 py-2.5 text-sm transition-colors ${
                              issueType === type.value
                                ? 'bg-primary-500/10 text-primary-400'
                                : 'text-ink-200 hover:bg-ink-700/40'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-100 block mb-2">
                  Issue Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors({ ...errors, subject: undefined });
                  }}
                  placeholder="Brief summary of the issue"
                  className={`w-full rounded-lg border bg-ink-850/60 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-400 outline-none transition-colors ${
                    errors.subject
                      ? 'border-red-500/50 focus:border-red-400'
                      : 'border-ink-700/60 focus:border-primary-500/50 hover:border-ink-600'
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" strokeWidth={2} />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-ink-100 block mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Describe the issue in detail. Include steps to reproduce if applicable."
                  rows={5}
                  className={`w-full rounded-lg border bg-ink-850/60 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-400 outline-none transition-colors resize-none ${
                    errors.description
                      ? 'border-red-500/50 focus:border-red-400'
                      : 'border-ink-700/60 focus:border-primary-500/50 hover:border-ink-600'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" strokeWidth={2} />
                    {errors.description}
                  </p>
                )}
                <p className="mt-1.5 text-[11px] text-ink-400">{description.length} characters</p>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-100 block mb-2">
                  File Attachment <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

                {fileName ? (
                  <div className="flex items-center gap-3 rounded-lg border border-primary-500/30 bg-primary-500/5 px-3.5 py-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/15 border border-primary-500/20">
                      <Paperclip className="h-4 w-4 text-primary-400" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-100 truncate">{fileName}</p>
                      <p className="text-[11px] text-ink-400">{formatBytes(fileSize)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-3 rounded-lg border border-dashed border-ink-600 bg-ink-850/40 px-3.5 py-3 text-ink-400 hover:border-primary-500/40 hover:text-ink-200 transition-colors"
                  >
                    <Paperclip className="h-4.5 w-4.5" strokeWidth={1.8} />
                    <span className="text-sm">Click to attach a file (screenshots, logs, CSV samples)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-ink-300 hover:text-ink-100 hover:border-ink-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
