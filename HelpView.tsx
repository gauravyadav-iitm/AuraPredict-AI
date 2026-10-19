import { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, ExternalLink, Search, Mail, Clock, Copy, Check, Ticket } from 'lucide-react';
import TicketModal from '@/components/TicketModal';
import CommunityForum from '@/components/CommunityForum';

const SUPPORT_EMAIL = 'aurapredictai@gmail.com';

export default function HelpView() {
  const [copied, setCopied] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [forumVisible, setForumVisible] = useState(false);

  const faqs = [
    {
      q: 'What CSV format does AuraPredict.AI expect?',
      a: 'The parser auto-detects columns using fuzzy header matching. Common headers like "name", "email", "revenue", "MRR", "last login", and "churn score" are recognized automatically. Any unrecognized columns are safely ignored.',
    },
    {
      q: 'How is the churn risk score calculated?',
      a: 'The score is computed from behavioral signals: days since last login, support ticket volume, usage trend direction, monthly revenue, and account age. If your CSV already includes a churn score column, that value is used directly.',
    },
    {
      q: 'What happens to duplicate and invalid rows?',
      a: 'Rows missing both name and email are dropped as invalid. Exact duplicates (same name + email) are removed. Missing values in individual fields are auto-filled with sensible defaults so the record remains usable.',
    },
    {
      q: 'Is my data stored anywhere?',
      a: 'CSV processing happens entirely in your browser. Your file never leaves your machine unless you explicitly enable server-side persistence in Settings.',
    },
  ];

  const copyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 rounded-lg border border-ink-700/60 bg-ink-850/60 px-4 py-3 mb-6">
          <Search className="h-4.5 w-4.5 text-ink-400" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search help articles..."
            className="flex-1 bg-transparent text-sm text-ink-100 placeholder:text-ink-400 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setTicketOpen(true)}
            className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 mb-3 group-hover:bg-amber-500/20 transition-colors">
              <Ticket className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-sm font-semibold text-white">Raise a Ticket</p>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed">Submit a support ticket with subject, description, and optional file attachment.</p>
          </div>

          <div
            onClick={() => {
              setForumVisible(true);
              setTimeout(() => {
                document.getElementById('community-forum')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className="rounded-xl border border-accent-500/20 bg-accent-500/10 p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10 mb-3 group-hover:bg-accent-500/20 transition-colors">
              <MessageSquare className="h-5 w-5 text-accent-400" strokeWidth={1.8} />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-sm font-semibold text-white">Community Forum</p>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed">Browse developer discussion threads on data queries, churn models, and integrations.</p>
          </div>

          <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 mb-3 group-hover:bg-primary-500/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary-400" strokeWidth={1.8} />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-sm font-semibold text-white">Documentation</p>
              <ExternalLink className="h-3 w-3 text-ink-400" strokeWidth={1.8} />
            </div>
            <p className="text-xs text-ink-400 leading-relaxed">Full API reference, integration guides, and tutorials.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-ink-700/40 bg-ink-850/30 p-4">
              <p className="text-sm font-medium text-ink-100 mb-2">{faq.q}</p>
              <p className="text-sm text-ink-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="community-forum">
        <CommunityForum />
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 mb-4">
              <Mail className="h-7 w-7 text-primary-400" strokeWidth={1.6} />
              <div className="absolute -inset-1 rounded-2xl bg-primary-500/10 blur-xl -z-10" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Get in Touch</h3>
            <p className="text-sm text-ink-400 max-w-md mb-5">
              Have a question that's not covered here? Our team is ready to help — reach out and we'll get back to you promptly.
            </p>

            <div className="w-full max-w-md rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <Mail className="h-5 w-5 text-primary-400" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Support Email</p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="block text-sm font-medium text-ink-100 hover:text-primary-400 transition-colors truncate"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
                <button
                  onClick={copyEmail}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-ink-600 text-ink-400 hover:text-primary-400 hover:border-primary-500/40 transition-colors"
                  title="Copy email address"
                >
                  {copied ? <Check className="h-4 w-4 text-primary-400" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <button
                onClick={() => setTicketOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                <Ticket className="h-4 w-4" strokeWidth={1.8} />
                Raise a Ticket
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=AuraPredict.AI%20Support%20Request`}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-medium text-ink-300 hover:text-ink-100 hover:border-ink-500 transition-colors"
              >
                <Mail className="h-4 w-4" strokeWidth={1.8} />
                Email Support
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-ink-400">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Average response time: under 2 hours during business days</span>
            </div>
          </div>
        </div>
      </div>

      <TicketModal open={ticketOpen} onClose={() => setTicketOpen(false)} />
    </div>
  );
}
