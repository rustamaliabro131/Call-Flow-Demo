import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  PhoneCall,
  Brain,
  FileText,
  CheckCircle2,
  Database,
  Calendar,
  MessageSquare,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Plus,
  Sliders,
  Settings,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';

export const AutomationWorkflowsView: React.FC = () => {
  const { workflows, toggleWorkflow, runWorkflowSimulation } = useCallFlow();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || 'wf-1');
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [activeSimNodeIdx, setActiveSimNodeIdx] = useState<number | null>(null);

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleRunTest = async () => {
    if (!selectedWorkflow) return;
    setIsRunningSim(true);

    // Step through each node visually
    for (let i = 0; i < selectedWorkflow.nodes.length; i++) {
      setActiveSimNodeIdx(i);
      await new Promise(resolve => setTimeout(resolve, 450));
    }

    await runWorkflowSimulation(selectedWorkflow.id);
    setActiveSimNodeIdx(null);
    setIsRunningSim(false);
  };

  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'PhoneCall':
        return PhoneCall;
      case 'Brain':
        return Brain;
      case 'FileText':
        return FileText;
      case 'CheckCircle':
        return CheckCircle2;
      case 'Database':
        return Database;
      case 'Calendar':
        return Calendar;
      case 'MessageSquare':
        return MessageSquare;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Workflow className="w-4 h-4" />
            <span>Autonomous Pipeline Orchestration</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Automation Workflows
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Design multi-stage triggers that transcribe calls, synthesize summaries, gate manager approvals, and update CRM records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunTest}
            disabled={isRunningSim || !selectedWorkflow?.enabled}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningSim ? 'animate-pulse' : ''}`} />
            <span>{isRunningSim ? 'Simulating Pipeline...' : 'Test Run Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Workflow Selector Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflows.map(wf => {
          const isSelected = wf.id === selectedWorkflowId;
          return (
            <div
              key={wf.id}
              onClick={() => setSelectedWorkflowId(wf.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 dark:bg-slate-900 light:bg-white border-blue-500/60 shadow-lg shadow-blue-500/5'
                  : 'bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                      wf.enabled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {wf.enabled ? 'Active Pipeline' : 'Paused'}
                  </span>

                  {/* Toggle switch */}
                  <label
                    className="relative inline-flex items-center cursor-pointer"
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={wf.enabled}
                      onChange={() => toggleWorkflow(wf.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <h3 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-900 leading-snug">
                  {wf.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Runs: {wf.successfulRuns}</span>
                <span>Last: {wf.lastExecution}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Workflow Canvas Builder */}
      {selectedWorkflow && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  {selectedWorkflow.name}
                </h2>
                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  {selectedWorkflow.nodes.length} Stages
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Trigger: <span className="text-slate-300 font-mono">{selectedWorkflow.triggerEvent}</span> · Auto-dispatch enabled
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Trigger on Event:</span>
              <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                ⚡ Outbound Call Terminated
              </span>
            </div>
          </div>

          {/* Visual Node Diagram */}
          <div className="py-6 px-2 overflow-x-auto">
            <div className="flex items-center min-w-max gap-3 py-4">
              {selectedWorkflow.nodes.map((node, index) => {
                const Icon = getNodeIcon(node.icon);
                const isStepActive = activeSimNodeIdx === index;
                const isPastStep = activeSimNodeIdx !== null && activeSimNodeIdx > index;

                return (
                  <React.Fragment key={node.id}>
                    {/* Visual Node Box */}
                    <div
                      className={`relative w-56 p-4 rounded-2xl border transition-all duration-300 shadow-md ${
                        isStepActive
                          ? 'bg-blue-600/20 border-blue-400 ring-2 ring-blue-500/50 scale-105'
                          : isPastStep
                          ? 'bg-slate-950/80 border-emerald-500/60'
                          : 'bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-slate-800/80'
                      }`}
                    >
                      {/* Step index badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          Stage {index + 1}
                        </span>
                        {isPastStep ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        ) : isStepActive ? (
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700" />
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isStepActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-900 truncate">
                          {node.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed min-h-[32px]">
                        {node.subtitle}
                      </p>
                    </div>

                    {/* Connecting Connector Line */}
                    {index < selectedWorkflow.nodes.length - 1 && (
                      <div className="flex items-center px-1 text-slate-600">
                        <div
                          className={`w-8 h-0.5 transition-colors duration-300 ${
                            isPastStep || isStepActive ? 'bg-blue-500' : 'bg-slate-700'
                          }`}
                        />
                        <ArrowRight
                          className={`w-3.5 h-3.5 -ml-1 transition-colors ${
                            isPastStep || isStepActive ? 'text-blue-400' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node Execution Logs / Diagnostic Summary */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-300">Live Engine Diagnostics</span>
              <span className="font-mono text-slate-500 text-[11px]">SLA Latency: ~1.2s per call</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <div>
                Average Execution Time:{' '}
                <span className="font-mono text-slate-200 font-semibold">1,240ms</span>
              </div>
              <div>
                Failure Rate:{' '}
                <span className="font-mono text-emerald-400 font-semibold">0.02%</span>
              </div>
              <div>
                Manager Override Rate:{' '}
                <span className="font-mono text-blue-400 font-semibold">4.8%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
