import { useState } from 'react';
import { Bell, Shield, Database, Palette, Globe, Save, Mail, Copy, Check } from 'lucide-react';

const SUPPORT_EMAIL = 'aurapredictai@gmail.com';

export default function SettingsView() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoClean, setAutoClean] = useState(true);
  const [slackIntegration, setSlackIntegration] = useState(false);
  const [riskThreshold, setRiskThreshold] = useState('60');
  const [copied, setCopied] = useState(false);

  const toggle = (value: boolean, setter: (v: boolean) => void) => () => setter(!value);

  const copyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    {
      icon: Bell,
      title: 'Notifications',
      desc: 'Configure how and when you receive churn risk alerts',
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
    },
    {
      icon: Shield,
      title: 'Security',
      desc: 'Manage API keys, data access, and compliance settings',
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
    },
    {
      icon: Database,
      title: 'Data Pipeline',
      desc: 'CSV processing rules, dedup strategy, and retention',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Palette,
      title: 'Appearance',
      desc: 'Theme, density, and dashboard layout preferences',
      color: 'text-ink-200',
      bg: 'bg-ink-700/40',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="glass-panel rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.bg}`}>
                  <Icon className={`h-4.5 w-4.5 ${section.color}`} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              </div>
              <p className="text-xs text-ink-400">{section.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-5">Alert Preferences</h3>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-100">Email alerts for high-risk churn</p>
              <p className="text-xs text-ink-400 mt-0.5">Get notified when a customer crosses the high-risk threshold</p>
            </div>
            <button
              onClick={toggle(emailAlerts, setEmailAlerts)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${emailAlerts ? 'bg-primary-500' : 'bg-ink-600'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${emailAlerts ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-100">Auto-clean uploaded data</p>
              <p className="text-xs text-ink-400 mt-0.5">Automatically deduplicate and fill missing values on upload</p>
            </div>
            <button
              onClick={toggle(autoClean, setAutoClean)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${autoClean ? 'bg-primary-500' : 'bg-ink-600'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${autoClean ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-100">Slack integration</p>
              <p className="text-xs text-ink-400 mt-0.5">Send churn alerts to a Slack channel</p>
            </div>
            <button
              onClick={toggle(slackIntegration, setSlackIntegration)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${slackIntegration ? 'bg-primary-500' : 'bg-ink-600'}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${slackIntegration ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-ink-100">High-risk churn score threshold</label>
            <p className="text-xs text-ink-400 mt-0.5 mb-2">Customers at or above this score trigger alerts</p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="40"
                max="90"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(e.target.value)}
                className="flex-1 accent-primary-500"
              />
              <span className="text-sm font-mono font-bold text-primary-400 w-12 text-right">{riskThreshold}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 pt-5 border-t border-ink-700/40">
          <button className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
            <Save className="h-4 w-4" strokeWidth={1.8} />
            Save Changes
          </button>
          <button className="rounded-lg border border-ink-600 px-4 py-2 text-sm font-medium text-ink-300 hover:text-ink-100 hover:border-ink-500 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10">
            <Globe className="h-4.5 w-4.5 text-accent-400" strokeWidth={1.8} />
          </div>
          <h3 className="text-base font-semibold text-white">Workspace Info</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-ink-400 mb-1">Workspace Name</p>
            <p className="text-sm text-ink-100">AuraPredict.AI Production</p>
          </div>
          <div>
            <p className="text-xs text-ink-400 mb-1">Plan</p>
            <p className="text-sm text-ink-100">Enterprise</p>
          </div>
          <div>
            <p className="text-xs text-ink-400 mb-1">Region</p>
            <p className="text-sm text-ink-100">us-east-1</p>
          </div>
          <div>
            <p className="text-xs text-ink-400 mb-1">API Key</p>
            <p className="text-sm font-mono text-ink-100">sk-prod-••••••••3f2a</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20">
            <Mail className="h-4.5 w-4.5 text-primary-400" strokeWidth={1.8} />
          </div>
          <h3 className="text-base font-semibold text-white">Support Contact</h3>
        </div>

        <p className="text-sm text-ink-400 mb-4">
          Need assistance with your account, data pipeline, or have a feature request? Reach out to our support team directly.
        </p>

        <div className="rounded-xl border border-ink-700/60 bg-ink-850/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20">
              <Mail className="h-5 w-5 text-primary-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Official Support Email</p>
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

        <div className="mt-4">
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=AuraPredict.AI%20Support%20Request`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            <Mail className="h-4 w-4" strokeWidth={1.8} />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
