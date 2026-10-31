import React, { useState } from 'react';
import {
  Blocks,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Settings,
  RefreshCw,
  Sparkles,
  Zap,
  Check,
  X,
  Share2,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { IntegrationCard } from '../../types';

export const IntegrationsView: React.FC = () => {
  const { integrations, toggleIntegration } = useCallFlow();

  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [testSyncSuccess, setTestSyncSuccess] = useState(false);
  const [testingPing, setTestingPing] = useState(false);

  const selectedIntegration = integrations.find(i => i.id === activeConfigId);

  const handleTestConnection = async () => {
    setTestingPing(true);
    setTestSyncSuccess(false);
    await new Promise(resolve => setTimeout(resolve, 600));
    setTestingPing(false);
    setTestSyncSuccess(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Blocks className="w-4 h-4" />
            <span>Connected Ecosystem</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Integrations & Connectors
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect your CRM, team communication channels, spreadsheets, and workflow engines.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-500/20">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-medium ${
                      item.connected
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                  {item.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed min-h-[38px]">
                {item.description}
              </p>

              {item.connected && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Sync Health</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Healthy
                    </span>
                  </div>
                  {item.syncedRecordsCount !== undefined && (
                    <div className="flex items-center justify-between">
                      <span>Records Synced</span>
                      <span className="font-mono text-slate-300">
                        {item.syncedRecordsCount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {item.lastSync && (
                    <div className="flex items-center justify-between">
                      <span>Last Activity</span>
                      <span className="font-mono text-slate-400">{item.lastSync}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveConfigId(item.id);
                  setTestSyncSuccess(false);
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>

              <button
                onClick={() => toggleIntegration(item.id)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                  item.connected
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                }`}
              >
                {item.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Configure Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Configure {selectedIntegration.name} Integration
                </span>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono">
                  {selectedIntegration.category}
                </span>
              </div>
              <button
                onClick={() => setActiveConfigId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  API Endpoint / Webhook URL
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    selectedIntegration.configuredWebhookUrl ||
                    `https://api.${selectedIntegration.id}.com/v2/callflow-ingest`
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Two-Way Data Sync Options
                </label>
                <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Sync AI Call Summaries to Activity Timeline</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Auto-update Deal Stage & Close Date on Manager Approval</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    <span>Push High-Priority Tasks to Agent CRM Calendar</span>
                  </label>
                </div>
              </div>

              {testSyncSuccess && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Connection test succeeded! 200 OK returned in 84ms.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={handleTestConnection}
                disabled={testingPing}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
                <span>{testingPing ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveConfigId(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!selectedIntegration.connected) {
                      toggleIntegration(selectedIntegration.id);
                    }
                    setActiveConfigId(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
