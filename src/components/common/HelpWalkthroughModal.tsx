import React from 'react';
import {
  X,
  UploadCloud,
  Headphones,
  Sparkles,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';

export const HelpWalkthroughModal: React.FC = () => {
  const { isHelpOpen, setIsHelpOpen, setActiveTab, setSelectedCallId } = useCallFlow();

  if (!isHelpOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Upload Call Transcripts',
      desc: 'Navigate to Import Center to drag-and-drop a CSV batch or paste raw transcript text.',
      tab: 'import',
      actionLabel: 'Go to Import Center',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'Review Processed Calls',
      desc: 'Browse Call Intelligence table with customer name, duration, outcome, and speech sentiment.',
      tab: 'intelligence',
      actionLabel: 'View Call Table',
      icon: Headphones,
    },
    {
      step: '03',
      title: 'Inspect AI Analysis',
      desc: 'Open any call to examine AI Summaries, Key Interests, Customer Objections, and Next Steps.',
      tab: 'intelligence',
      callId: 'call-101',
      actionLabel: 'Open Sample Call #101',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Manager Approval & CRM Sync',
      desc: 'Review AI-generated CRM field suggestions (Deal Stage, ARR, Target Date). Approve or edit them.',
      tab: 'reviews',
      actionLabel: 'Go to Approval Queue',
      icon: CheckCircle2,
    },
    {
      step: '05',
      title: 'Automated Task Creation',
      desc: 'Approving suggestions automatically triggers high-priority follow-up tasks for the sales agent.',
      tab: 'tasks',
      actionLabel: 'See Generated Tasks',
      icon: ListTodo,
    },
    {
      step: '06',
      title: 'Real-Time Metrics Live Update',
      desc: 'Watch Dashboard KPIs (Processed Calls, Pending Approvals, Pipeline ARR) update instantly.',
      tab: 'overview',
      actionLabel: 'Return to Dashboard',
      icon: TrendingUp,
    },
  ];

  const handleStepAction = (tab: string, callId?: string) => {
    setActiveTab(tab);
    if (callId) {
      setSelectedCallId(callId);
    }
    setIsHelpOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 dark:bg-slate-900 light:bg-white rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                CallFlow AI — Core Product Journey
              </h2>
              <p className="text-xs text-slate-400">
                How outbound sales teams automate post-call operations in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {steps.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-4 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col justify-between hover:border-blue-500/40 transition-colors group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-blue-400 tracking-wider">
                        STEP {s.step}
                      </span>
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>

                  <button
                    onClick={() => handleStepAction(s.tab, s.callId)}
                    className="mt-4 flex items-center justify-between px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg transition-colors"
                  >
                    <span>{s.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Tip: Try importing a CSV in Import Center, then approve suggestions in Call Reviews!
          </span>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};
