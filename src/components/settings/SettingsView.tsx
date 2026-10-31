import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sparkles,
  Shield,
  Bell,
  Building,
  UploadCloud,
  Database,
  Lock,
  Check,
  Save,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'org' | 'notifications' | 'security'>('ai');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [orgName, setOrgName] = useState('Apex Global Sales Operations');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [hipaaRedaction, setHipaaRedaction] = useState(true);
  const [autoApproveVoicemails, setAutoApproveVoicemails] = useState(true);
  const [slackAlertsEnabled, setSlackAlertsEnabled] = useState(true);
  const [slackChannel, setSlackChannel] = useState('#sales-approvals-live');
  const [promptInstructions, setPromptInstructions] = useState(
    'Prioritize detecting competitor mentions (LegacyTrack, Salesforce Einstein, Dialpad) and identify commercial contract timelines or budget renewal dates.'
  );

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Workspace Configuration</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Settings & Model Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fine-tune AI transcript analysis parameters, HIPAA compliance redaction, and CRM webhook routing.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Preferences Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Extraction Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('org')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'org'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Organization Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'notifications'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notification Webhooks</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Compliance</span>
        </button>
      </div>

      {/* Tab: AI Preferences */}
      {activeTab === 'ai' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mb-1">
              Speech Analytics & Extraction Rules
            </h3>
            <p className="text-slate-400">
              Customize how CallFlow AI extracts objections, identifies buyer intent, and suggests CRM field values.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold">
                  Minimum AI Confidence Score for Auto-Staging
                </label>
                <span className="font-mono text-blue-400 font-bold">{aiConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={aiConfidenceThreshold}
                onChange={e => setAiConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 bg-slate-800 h-2 rounded-lg"
              />
              <span className="text-[11px] text-slate-500">
                Suggestions below this threshold are flagged for manual managerial confirmation.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Custom Domain Extraction Guidelines
              </label>
              <textarea
                rows={4}
                value={promptInstructions}
                onChange={e => setPromptInstructions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-slate-200 font-semibold block">
                    Auto-Approve Low-Risk Voicemail Outcomes
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Bypasses manager review queue when call duration is under 45 seconds.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoApproveVoicemails}
                  onChange={e => setAutoApproveVoicemails(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Organization Profile */}
      {activeTab === 'org' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Organization Details</h3>
            <p className="text-slate-400">Settings applied across all team workspaces and phone lines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Default Reporting Timezone</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Notification Webhooks */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Alerts & Broadcast Channels</h3>
            <p className="text-slate-400">Receive instant push notifications when high-value deals are processed.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-slate-200 font-semibold block">
                    Slack Notifications for High-ARR Deals (&gt; $30k)
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Alert sales leadership in designated triage channel.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={slackAlertsEnabled}
                  onChange={e => setSlackAlertsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>

              {slackAlertsEnabled && (
                <div className="pt-2">
                  <label className="block text-slate-400 mb-1">Destination Channel</label>
                  <input
                    type="text"
                    value={slackChannel}
                    onChange={e => setSlackChannel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-[11px]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security & Compliance */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Security, Privacy & Redaction</h3>
            <p className="text-slate-400">Enterprise grade compliance protection for recorded voice calls.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-slate-200 font-semibold block">
                  Automatic HIPAA / PCI-DSS Sensitive Data Redaction
                </span>
                <span className="text-slate-400 text-[11px]">
                  Detects and masks credit card numbers, social security digits, and medical details before storage.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hipaaRedaction}
                onChange={e => setHipaaRedaction(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-blue-300">
            🔒 SOC2 Type II Certified · 256-Bit TLS In-Transit Encryption · Private VPC Isolation Active
          </div>
        </div>
      )}
    </div>
  );
};
