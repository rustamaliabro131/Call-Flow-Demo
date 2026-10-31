import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useCallFlow } from '../../context/CallFlowContext';

export const ReportsView: React.FC = () => {
  const { calls, teamMembers, metrics } = useCallFlow();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'q4' | 'ytd'>('30d');

  const volumeTrends = [
    { date: 'Oct 01', volume: 120, conversion: 18 },
    { date: 'Oct 06', volume: 145, conversion: 24 },
    { date: 'Oct 11', volume: 168, conversion: 32 },
    { date: 'Oct 16', volume: 190, conversion: 38 },
    { date: 'Oct 21', volume: 215, conversion: 44 },
    { date: 'Oct 26', volume: 240, conversion: 52 },
    { date: 'Oct 30', volume: 285, conversion: 61 },
  ];

  const agentStats = [
    { name: 'Sarah Jenkins', calls: 412, closeRate: 28.4, approvalRate: 98.2, avgDuration: '08:45' },
    { name: 'David Chen', calls: 398, closeRate: 26.1, approvalRate: 96.8, avgDuration: '07:15' },
    { name: 'Liam Miller', calls: 345, closeRate: 22.5, approvalRate: 94.0, avgDuration: '07:55' },
    { name: 'Alex Morgan', calls: 184, closeRate: 34.0, approvalRate: 99.1, avgDuration: '06:30' },
  ];

  const handleExportCSV = () => {
    let csv = 'CallID,CustomerName,Company,Agent,Duration,Outcome,Sentiment,SentimentScore,ReviewStatus\n';
    calls.forEach(c => {
      csv += `"${c.id}","${c.customerName}","${c.customerCompany}","${c.agentName}","${c.callDuration}","${c.callOutcome}","${c.sentiment}",${c.sentimentScore},"${c.reviewStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `callflow_analytics_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Operational Telemetry & Insights</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fleet conversion ratios, speech AI processing latency, and sales agent performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="q4">Q4 2026</option>
            <option value="ytd">Year to Date</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Top Statistical Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80">
          <div className="text-xs text-slate-400">Total Calls Logged</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">1,339</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">+22.4% vs previous period</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80">
          <div className="text-xs text-slate-400">Follow-up SLA Met</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">94.8%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Under 24 hour turn-around</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80">
          <div className="text-xs text-slate-400">Average Speech Summary Latency</div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">1.8s</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct edge transcription</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80">
          <div className="text-xs text-slate-400">CRM Field Extraction Accuracy</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">98.2%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Based on manager approvals</div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Outbound Volume & Closed Opportunities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              30-day aggregate call load versus confirmed pipeline conversions
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
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
              <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Calls" />
              <Bar dataKey="conversion" fill="#10b981" radius={[4, 4, 0, 0]} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance Leaderboard Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Outbound Agent Productivity & Accuracy Leaderboard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual rep call counts, conversion rates, and manager suggestion approval frequency
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Sales Agent</th>
                <th className="py-2.5 px-3">Calls Handled</th>
                <th className="py-2.5 px-3">Conversion Rate</th>
                <th className="py-2.5 px-3">CRM Approval Rate</th>
                <th className="py-2.5 px-3">Average Call Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {agentStats.map((agent, i) => (
                <tr key={agent.name} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-200 flex items-center gap-2">
                    <span className="font-mono text-slate-500 text-[11px] w-4">{i + 1}.</span>
                    <span>{agent.name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-300">{agent.calls}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-emerald-400 font-semibold">
                    {agent.closeRate}%
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-blue-400">
                    {agent.approvalRate}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{agent.avgDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
