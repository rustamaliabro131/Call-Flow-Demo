import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  Edit2,
  Calendar,
  ThumbsDown,
  ArrowRight,
  ShieldAlert,
  Clock,
  Database,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { CallRecord, CrmFieldUpdate } from '../../types';
import { CallDetailDrawer } from './CallDetailDrawer';

export const CallReviewsView: React.FC = () => {
  const {
    calls,
    approveCallSuggestions,
    rejectCallSuggestions,
    editCallSuggestions,
    selectedCallId,
    setSelectedCallId,
  } = useCallFlow();

  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [rejectingCallId, setRejectingCallId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editingCallId, setEditingCallId] = useState<string | null>(null);
  const [editableFields, setEditableFields] = useState<CrmFieldUpdate[]>([]);

  const pendingCalls = calls.filter(c => c.reviewStatus === 'pending');
  const reviewedCalls = calls.filter(c => c.reviewStatus !== 'pending');

  const handleBatchApproveAll = () => {
    pendingCalls.forEach(call => {
      approveCallSuggestions(call.id);
    });
  };

  const startEditing = (call: CallRecord) => {
    setEditingCallId(call.id);
    setEditableFields([...call.crmUpdates]);
  };

  const saveEditedCrm = () => {
    if (editingCallId) {
      editCallSuggestions(editingCallId, editableFields);
      setEditingCallId(null);
    }
  };

  const confirmRejection = () => {
    if (rejectingCallId) {
      rejectCallSuggestions(rejectingCallId, rejectionReason || 'Supervisor noted discrepancy.');
      setRejectingCallId(null);
      setRejectionReason('');
    }
  };

  const selectedCall = calls.find(c => c.id === selectedCallId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Batch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Supervisory Quality Control</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Call Reviews & CRM Staging Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit AI-extracted CRM field modifications and approve automated task dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCalls.length > 0 && (
            <button
              onClick={handleBatchApproveAll}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve All ({pendingCalls.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 rounded-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 w-fit text-xs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Pending Manager Review</span>
          <span className="font-mono tabular-nums px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {pendingCalls.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'reviewed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Review History</span>
          <span className="font-mono tabular-nums px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {reviewedCalls.length}
          </span>
        </button>
      </div>

      {/* Review Queue Cards */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingCalls.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-bold text-slate-200 mb-1">Queue is clear!</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                All AI suggestions have been audited and synchronized to your CRM systems.
              </p>
            </div>
          ) : (
            pendingCalls.map(call => (
              <div
                key={call.id}
                className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 shadow-xs space-y-4"
              >
                {/* Card Top Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {call.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                          {call.customerName}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-400">{call.customerCompany}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Agent: <span className="text-slate-300">{call.agentName}</span> · Duration:{' '}
                        <span className="font-mono text-slate-300">{call.callDuration}</span> ·{' '}
                        {call.callDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/25 font-medium">
                      Review Required
                    </span>
                    <button
                      onClick={() => setSelectedCallId(call.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1"
                    >
                      View Full Call →
                    </button>
                  </div>
                </div>

                {/* Summary & Proposed Changes Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  {/* Left: Summary and Objections */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Call Summary
                      </span>
                      <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 p-3 rounded-xl border border-slate-800/60">
                        {call.summary}
                      </p>
                    </div>

                    {call.objections.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                          Key Objection Detected
                        </span>
                        <div className="p-2.5 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-300 leading-relaxed">
                          "{call.objections[0].quote}"
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Proposed CRM Fields Table */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                        Proposed CRM Updates ({call.crmUpdates.length})
                      </span>
                      <button
                        onClick={() => startEditing(call)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Values</span>
                      </button>
                    </div>

                    <div className="rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 overflow-hidden bg-slate-950/40">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                            <th className="py-2 px-3">Field</th>
                            <th className="py-2 px-3">Current</th>
                            <th className="py-2 px-3 text-blue-400">Proposed Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {call.crmUpdates.map(field => (
                            <tr key={field.key} className="hover:bg-slate-800/20">
                              <td className="py-2 px-3 font-medium text-slate-300">{field.label}</td>
                              <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                                {field.currentValue}
                              </td>
                              <td className="py-2 px-3 font-semibold text-blue-400">
                                {field.suggestedValue}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Approving will automatically sync to Salesforce & create follow-up task.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectingCallId(call.id)}
                      className="px-3 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/25 transition-colors font-medium flex items-center gap-1.5"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => approveCallSuggestions(call.id)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Suggestions</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Review History */}
      {activeTab === 'reviewed' && (
        <div className="space-y-3">
          {reviewedCalls.map(call => (
            <div
              key={call.id}
              className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                    {call.customerName}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{call.customerCompany}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Reviewed by: <span className="text-slate-300">{call.reviewedBy || 'Manager'}</span> at{' '}
                  <span className="font-mono">{call.reviewedAt || call.callTime}</span>
                  {call.rejectionReason && (
                    <span className="text-rose-400 ml-2">Reason: {call.rejectionReason}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                    call.reviewStatus === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                  }`}
                >
                  {call.reviewStatus.toUpperCase()}
                </span>

                <button
                  onClick={() => setSelectedCallId(call.id)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingCallId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Provide Rejection Feedback</h3>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="State reason for rejecting these CRM suggestions..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingCallId(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejection}
                className="px-4 py-1.5 font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-500"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit CRM Modal */}
      {editingCallId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Edit Staged CRM Fields</h3>
            <div className="space-y-3">
              {editableFields.map((f, i) => (
                <div key={f.key}>
                  <label className="block text-slate-300 font-medium mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={f.suggestedValue}
                    onChange={e => {
                      const next = [...editableFields];
                      next[i].suggestedValue = e.target.value;
                      setEditableFields(next);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingCallId(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedCrm}
                className="px-4 py-1.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Linked Detail Drawer */}
      {selectedCall && (
        <CallDetailDrawer
          call={selectedCall}
          onClose={() => setSelectedCallId(null)}
        />
      )}
    </div>
  );
};
