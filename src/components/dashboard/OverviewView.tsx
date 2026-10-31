import React from 'react';
import {
  PhoneCall,
  Sparkles,
  Clock,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  ArrowRight,
  UserCheck,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCallFlow } from '../../context/CallFlowContext';

export const OverviewView: React.FC = () => {
  const {
    calls,
    metrics,
    tasks,
    activityLogs,
    setActiveTab,
    setSelectedCallId,
    approveCallSuggestions,
  } = useCallFlow();

  const weeklyActivityData = [
    { day: 'Mon', calls: 142, processed: 140, approvals: 38 },
    { day: 'Tue', calls: 168, processed: 165, approvals: 45 },
    { day: 'Wed', calls: 195, processed: 192, approvals: 58 },
    { day: 'Thu', calls: 210, processed: 208, approvals: 62 },
    { day: 'Fri', calls: 184, processed: 181, approvals: 51 },
    { day: 'Sat', calls: 45, processed: 45, approvals: 12 },
    { day: 'Sun', calls: 28, processed: 28, approvals: 8 },
  ];

  // Outcome distribution for Pie Chart
  const outcomeCounts = calls.reduce((acc, c) => {
    acc[c.callOutcome] = (acc[c.callOutcome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outcomeColors: Record<string, string> = {
    Interested: '#3b82f6',
    'Follow-up Required': '#f59e0b',
    Converted: '#10b981',
    'Not Interested': '#64748b',
    'Left Voicemail': '#8b5cf6',
  };

  const outcomeChartData = Object.keys(outcomeCounts).map(name => ({
    name,
    value: outcomeCounts[name],
    color: outcomeColors[name] || '#94a3b8',
  }));

  const pendingCalls = calls.filter(c => c.reviewStatus === 'pending');
  const recentCalls = calls.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Action Strip */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/50 border border-blue-500/20 p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Outbound Operations Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
              CallFlow AI Central Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Real-time speech analytics, autonomous CRM sync, and managerial review workflows across your outbound fleet.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('import')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <span>+ Import Call Transcripts</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-2"
            >
              <span>Review Queue ({metrics.pendingApprovals})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Calls Processed */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Calls Processed</span>
            <PhoneCall className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              {metrics.totalCalls.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Avg length: </span>
            <span className="font-mono tabular-nums text-slate-300 dark:text-slate-300 light:text-slate-700">
              {metrics.avgDurationFormatted}
            </span>
          </div>
        </div>

        {/* AI Analyses Completed */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">AI Analyses Completed</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              {metrics.aiAnalysesCompleted.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-indigo-400">100% extracted</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Objections & CRM tags ready</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => setActiveTab('reviews')}
          className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 backdrop-blur-sm hover:border-amber-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-amber-400/90 group-hover:text-amber-400">
              Pending Approvals
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              {metrics.pendingApprovals}
            </span>
            <span className="text-xs text-slate-400">calls await sign-off</span>
          </div>
          <div className="text-[11px] text-amber-400/80 group-hover:text-amber-300 mt-1 flex items-center gap-1 font-medium">
            <span>Open approval queue</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Follow-up Tasks */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 backdrop-blur-sm hover:border-blue-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Follow-up Tasks</span>
            <ListTodo className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              {metrics.openTasksCount}
            </span>
            <span className="text-xs text-slate-400">open · {metrics.completedTasksCount} done</span>
          </div>
          <div className="text-[11px] text-blue-400/80 group-hover:text-blue-300 mt-1 flex items-center gap-1 font-medium">
            <span>View task kanban</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Call Activity Chart (Area) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Weekly Call Activity & Analysis Volume
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total calls logged vs automated AI transcript processing
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-400">Total Calls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-slate-400">Processed</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
                <Area type="monotone" dataKey="processed" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorProc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Call Outcome Distribution (Donut) */}
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Call Outcome Distribution
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of conversation results
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {outcomeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Outcome Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
            {outcomeChartData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="font-mono tabular-nums font-semibold text-slate-200 ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Pending Manager Reviews & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Manager Reviews Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Pending Manager Reviews ({pendingCalls.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('reviews')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {pendingCalls.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-60" />
                All pending suggestions have been reviewed!
              </div>
            ) : (
              pendingCalls.slice(0, 3).map(call => (
                <div
                  key={call.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                          {call.customerName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs text-slate-400">{call.customerCompany}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Agent: <span className="text-slate-300">{call.agentName}</span> · Value:{' '}
                        <span className="font-mono tabular-nums text-emerald-400 font-medium">
                          ${call.dealValuePotential?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {call.crmUpdates.length} suggestions
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {call.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
                    <button
                      onClick={() => {
                        setSelectedCallId(call.id);
                        setActiveTab('intelligence');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Inspect Analysis & Transcript
                    </button>

                    <button
                      onClick={() => approveCallSuggestions(call.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                    >
                      Quick Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Automation Activity */}
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Recent Automation & Workflow Activity
            </h2>
            <button
              onClick={() => setActiveTab('workflows')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Manage Workflows
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map(act => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 border border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    By: <span className="text-slate-300">{act.actor}</span>
                    {act.meta && <span> · {act.meta}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Call Activity Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Recent Outbound Calls
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live incoming speech transcripts and automated post-call results
            </p>
          </div>
          <button
            onClick={() => setActiveTab('intelligence')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            View all calls ({calls.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Customer / Company</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 dark:divide-slate-800/50 light:divide-slate-200">
              {recentCalls.map(c => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setSelectedCallId(c.id);
                    setActiveTab('intelligence');
                  }}
                  className="hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                      {c.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400">{c.customerCompany}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{c.agentName}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-400">
                    {c.callDuration}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-medium text-slate-300">
                      {c.callOutcome}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-medium ${
                        c.sentiment === 'positive'
                          ? 'text-emerald-400'
                          : c.sentiment === 'negative'
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {c.sentimentScore}% {c.sentiment}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        c.reviewStatus === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : c.reviewStatus === 'rejected'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {c.reviewStatus === 'pending' ? 'Review Pending' : c.reviewStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
