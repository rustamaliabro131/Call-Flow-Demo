import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  Sparkles,
  Check,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Edit2,
  ThumbsDown,
  Calendar,
  Building,
  User,
  Phone,
  Clock,
  Database,
  Volume2,
  FileText,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { CallRecord, CrmFieldUpdate, SentimentType } from '../../types';
import { useCallFlow } from '../../context/CallFlowContext';

interface CallDetailDrawerProps {
  call: CallRecord;
  onClose: () => void;
}

export const CallDetailDrawer: React.FC<CallDetailDrawerProps> = ({ call, onClose }) => {
  const {
    approveCallSuggestions,
    rejectCallSuggestions,
    editCallSuggestions,
    createFollowUpTask,
  } = useCallFlow();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);
  const [activeTab, setActiveTab] = useState<'analysis' | 'transcript' | 'crm'>('analysis');

  // Modal states for user actions
  const [isEditingCrm, setIsEditingCrm] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Editable fields state
  const [editableFields, setEditableFields] = useState<CrmFieldUpdate[]>(call.crmUpdates);

  // New task form state
  const [taskTitle, setTaskTitle] = useState(
    call.suggestedNextSteps[0] || `Follow up with ${call.customerName}`
  );
  const [taskPriority, setTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [taskDueDate, setTaskDueDate] = useState('2026-11-04');
  const [taskType, setTaskType] = useState<'Call' | 'Email' | 'Demo' | 'Send Proposal' | 'Contract'>('Call');

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleApprove = () => {
    approveCallSuggestions(call.id, editableFields);
  };

  const handleSaveEditedCrm = () => {
    editCallSuggestions(call.id, editableFields);
    setIsEditingCrm(false);
  };

  const handleConfirmReject = () => {
    rejectCallSuggestions(call.id, rejectionReason || 'Manager marked as inaccurate.');
    setIsRejecting(false);
  };

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    createFollowUpTask({
      title: taskTitle,
      customerName: call.customerName,
      customerCompany: call.customerCompany,
      assignedAgent: call.agentName,
      priority: taskPriority,
      dueDate: taskDueDate,
      status: 'todo',
      relatedCallId: call.id,
      description: `Task created from call review with ${call.customerName}.`,
      actionType: taskType,
    });
    setIsCreatingTask(false);
  };

  const getSentimentBadge = (s: SentimentType, score: number) => {
    switch (s) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Positive ({score}%)
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Negative ({score}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Neutral ({score}%)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 dark:bg-slate-900 light:bg-white border-l border-slate-800 dark:border-slate-800 light:border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header Strip */}
        <div className="p-5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400">ID: {call.id}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{call.callDate} at {call.callTime}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-medium text-blue-400">{call.callOutcome}</span>
            </div>
            <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <span>{call.customerName}</span>
              <span className="text-slate-500 font-normal">/</span>
              <span className="text-slate-300 dark:text-slate-300 light:text-slate-700">{call.customerCompany}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Waveform Player Simulation */}
        <div className="px-5 py-3.5 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center gap-4">
          <button
            onClick={togglePlayback}
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 transition-transform active:scale-95"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Call Recording ({call.callDuration})</span>
              </span>
              <span>{isPlaying ? 'Playing 02:14 / ' + call.callDuration : '00:00 / ' + call.callDuration}</span>
            </div>

            {/* Visualizer bars */}
            <div className="h-7 flex items-center gap-1 overflow-hidden py-1">
              {(call.audioWaveformData || [30, 45, 60, 20, 80, 50, 90, 70, 40, 65, 80, 45, 70, 90, 60, 40, 75, 50, 30, 60, 80]).map(
                (h, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-200 ${
                      idx < (call.audioWaveformData?.length || 20) * (isPlaying ? 0.6 : 0.25)
                        ? 'bg-blue-500'
                        : 'bg-slate-700/60'
                    }`}
                    style={{ height: `${Math.max(15, h)}%` }}
                  />
                )
              )}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-[11px] text-slate-400">Agent</div>
            <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
              {call.agentName}
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-2.5 text-xs font-semibold px-2 border-b-2 transition-colors ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Intelligence & Analysis
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-2.5 text-xs font-semibold px-2 border-b-2 transition-colors ${
              activeTab === 'transcript'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Dialogue Transcript ({call.transcript.length} turns)
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`pb-2.5 text-xs font-semibold px-2 border-b-2 transition-colors ${
              activeTab === 'crm'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CRM Staged Updates ({call.crmUpdates.length})
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Top Overview Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone</span>
                  <div className="font-mono text-slate-200 dark:text-slate-200 light:text-slate-800 mt-0.5 truncate">
                    {call.customerPhone}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Outcome</span>
                  <div className="font-semibold text-blue-400 mt-0.5">{call.callOutcome}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Sentiment</span>
                  <div className="mt-0.5">{getSentimentBadge(call.sentiment, call.sentimentScore)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Review Status</span>
                  <div className="mt-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        call.reviewStatus === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : call.reviewStatus === 'rejected'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                      }`}
                    >
                      {call.reviewStatus === 'pending' ? 'Pending Review' : call.reviewStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Summary */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                    Executive Call Summary
                  </h3>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed text-xs">
                  {call.summary}
                </div>
              </div>

              {/* Key Takeaways */}
              {call.keyTakeaways && call.keyTakeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-800 mb-2">
                    Key Discussion Takeaways
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-400 pl-1">
                    {call.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="text-slate-300 dark:text-slate-300 light:text-slate-700">
                          {takeaway}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customer Interests & Objections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Interests */}
                <div className="p-4 rounded-xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                    <Lightbulb className="w-4 h-4" />
                    <h4 className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                      Customer Interests ({call.interests.length})
                    </h4>
                  </div>
                  {call.interests.length === 0 ? (
                    <p className="text-slate-500 italic">No specific products identified.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {call.interests.map(item => (
                        <div key={item.id} className="border-l-2 border-emerald-500/50 pl-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                              {item.topic}
                            </span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                              {item.strength}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Objections Identified */}
                <div className="p-4 rounded-xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
                  <div className="flex items-center gap-2 text-rose-400 mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                      Objections Raised ({call.objections.length})
                    </h4>
                  </div>
                  {call.objections.length === 0 ? (
                    <p className="text-slate-500 italic">No blockers or objections detected on this call.</p>
                  ) : (
                    <div className="space-y-3">
                      {call.objections.map(obj => (
                        <div key={obj.id} className="border-l-2 border-rose-500/50 pl-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                              {obj.objection}
                            </span>
                            <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">
                              {obj.category}
                            </span>
                          </div>
                          <blockquote className="text-[11px] text-slate-400 italic mt-1 bg-slate-900/60 p-2 rounded">
                            "{obj.quote}"
                          </blockquote>
                          <p className="text-[11px] text-indigo-300 mt-1 font-medium">
                            Suggested Rebuttal: {obj.suggestedRebuttal}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Suggested Next Steps */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Suggested Next Steps</span>
                  </h4>
                  <button
                    onClick={() => setIsCreatingTask(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    + Convert to Custom Task
                  </button>
                </div>
                <div className="space-y-2">
                  {call.suggestedNextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 border border-slate-800/60"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Generated CRM Updates Card */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                      AI-Generated CRM Updates
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsEditingCrm(true)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Values</span>
                  </button>
                </div>

                <div className="border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 text-slate-400 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                        <th className="py-2 px-3 font-medium">CRM Field</th>
                        <th className="py-2 px-3 font-medium">Current in CRM</th>
                        <th className="py-2 px-3 font-medium text-blue-400">Proposed by CallFlow AI</th>
                        <th className="py-2 px-3 font-medium text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 dark:divide-slate-800/60 light:divide-slate-200 bg-slate-950/30">
                      {call.crmUpdates.map(field => (
                        <tr key={field.key} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                            {field.label}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                            {field.currentValue}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-blue-400">
                            {field.suggestedValue}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-400 text-[11px]">
                            {field.confidence}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs">
                💡 High-intent statements and customer objections are color-highlighted automatically.
              </div>

              <div className="space-y-2.5">
                {call.transcript.map(line => (
                  <div
                    key={line.id}
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      line.speaker === 'Customer'
                        ? 'bg-slate-950/60 border-slate-800/80'
                        : 'bg-blue-950/20 border-blue-900/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span
                        className={`font-semibold ${
                          line.speaker === 'Customer' ? 'text-purple-400' : 'text-blue-400'
                        }`}
                      >
                        {line.speaker === 'Customer' ? call.customerName : call.agentName} ({line.speaker})
                      </span>
                      <span className="font-mono text-slate-500">{line.timestamp}</span>
                    </div>

                    <p className="text-slate-200 dark:text-slate-200 light:text-slate-800">
                      {line.text}
                    </p>

                    {line.isObjection && (
                      <div className="mt-1.5 text-[10px] font-medium text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Objection detected: Contract / Vendor Lock-in</span>
                      </div>
                    )}
                    {line.isInterest && (
                      <div className="mt-1.5 text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>High buying interest detected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <h4 className="font-semibold text-slate-200 mb-1">CRM Target Sync Destination</h4>
                <p className="text-slate-400">
                  Synced directly with Salesforce & HubSpot Deal ID: <span className="font-mono text-blue-400">OPP-89214</span>
                </p>
              </div>

              <div className="space-y-3">
                {call.crmUpdates.map(f => (
                  <div
                    key={f.key}
                    className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{f.label}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Current: <span className="line-through">{f.currentValue}</span> → Proposed:{' '}
                        <span className="text-blue-400 font-semibold">{f.suggestedValue}</span>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 text-xs">{f.confidence}% Conf</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer Strip */}
        <div className="p-4 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRejecting(true)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1.5"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              onClick={() => setIsEditingCrm(true)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreatingTask(true)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 border border-blue-500/30 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>

            <button
              onClick={handleApprove}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Sync CRM</span>
            </button>
          </div>
        </div>

        {/* Sub-Modal: Edit CRM Values */}
        {isEditingCrm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Edit Suggested CRM Fields</h3>
                <button onClick={() => setIsEditingCrm(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {editableFields.map((f, idx) => (
                  <div key={f.key}>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={f.suggestedValue}
                      onChange={e => {
                        const next = [...editableFields];
                        next[idx].suggestedValue = e.target.value;
                        setEditableFields(next);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditingCrm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedCrm}
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Save Modifications
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Modal: Reject Reason */}
        {isRejecting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Reject AI Suggestions</h3>
                <button onClick={() => setIsRejecting(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Please provide feedback for model fine-tuning and supervisor audit trail:
              </p>

              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. Overestimated deal size, customer did not commit to timeline..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-500"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Modal: Create Custom Task */}
        {isCreatingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <form
              onSubmit={handleSaveNewTask}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-3.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Create Follow-up Task</h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingTask(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Action Type</label>
                  <select
                    value={taskType}
                    onChange={e => setTaskType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Demo">Demo</option>
                    <option value="Send Proposal">Send Proposal</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTask(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
