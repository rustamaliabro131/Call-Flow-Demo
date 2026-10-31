import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Headphones,
  Sparkles,
  Phone,
  User,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { CallOutcome, CallRecord } from '../../types';
import { CallDetailDrawer } from './CallDetailDrawer';

export const CallIntelligenceView: React.FC = () => {
  const { calls, selectedCallId, setSelectedCallId, setActiveTab } = useCallFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [reviewFilter, setReviewFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique agents
  const agents = useMemo(() => {
    return Array.from(new Set(calls.map(c => c.agentName)));
  }, [calls]);

  // Filtering & sorting logic
  const filteredCalls = useMemo(() => {
    let result = calls.filter(call => {
      const matchesSearch =
        searchTerm === '' ||
        call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.customerPhone.includes(searchTerm);

      const matchesOutcome =
        outcomeFilter === 'all' || call.callOutcome === outcomeFilter;

      const matchesAgent =
        agentFilter === 'all' || call.agentName === agentFilter;

      const matchesReview =
        reviewFilter === 'all' || call.reviewStatus === reviewFilter;

      return matchesSearch && matchesOutcome && matchesAgent && matchesReview;
    });

    result.sort((a, b) => {
      if (sortBy === 'duration') {
        const valA = a.callDurationSeconds || 0;
        const valB = b.callDurationSeconds || 0;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      if (sortBy === 'value') {
        const valA = a.dealValuePotential || 0;
        const valB = b.dealValuePotential || 0;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      // Date sort
      const dateA = new Date(`${a.callDate} ${a.callTime}`).getTime();
      const dateB = new Date(`${b.callDate} ${b.callTime}`).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [calls, searchTerm, outcomeFilter, agentFilter, reviewFilter, sortBy, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / itemsPerPage));
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedCall = calls.find(c => c.id === selectedCallId);

  const outcomeColors: Record<CallOutcome, string> = {
    Interested: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Follow-up Required': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Converted: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'Not Interested': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'Left Voicemail': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Call Intelligence & Speech Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Indexed call transcripts, speech sentiments, detected objections, and AI CRM proposals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('import')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Transcripts</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search prospect, company, agent or transcript content..."
            className="w-full bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Outcome filter */}
          <select
            value={outcomeFilter}
            onChange={e => {
              setOutcomeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg px-2.5 py-2 text-slate-300 dark:text-slate-300 light:text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Outcomes</option>
            <option value="Interested">Interested</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Converted">Converted</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Left Voicemail">Left Voicemail</option>
          </select>

          {/* Agent filter */}
          <select
            value={agentFilter}
            onChange={e => {
              setAgentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg px-2.5 py-2 text-slate-300 dark:text-slate-300 light:text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Agents</option>
            {agents.map(a => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Review status filter */}
          <select
            value={reviewFilter}
            onChange={e => {
              setReviewFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg px-2.5 py-2 text-slate-300 dark:text-slate-300 light:text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Review States</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-1 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg p-0.5">
            <button
              onClick={() => {
                setSortBy(sortBy === 'date' ? 'duration' : sortBy === 'duration' ? 'value' : 'date');
              }}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white flex items-center gap-1 font-medium"
            >
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Sort: {sortBy}</span>
            </button>
            <button
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="px-2 py-1 text-slate-400 hover:text-white font-mono text-[11px]"
              title="Toggle sort direction"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Calls Table Container */}
      <div className="rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 font-semibold">
                <th className="py-3 px-4">Customer & Company</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 dark:divide-slate-800/50 light:divide-slate-200">
              {paginatedCalls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No calls match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedCalls.map(call => (
                  <tr
                    key={call.id}
                    onClick={() => setSelectedCallId(call.id)}
                    className="hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 flex items-center gap-2">
                        <span>{call.customerName}</span>
                        {call.dealValuePotential && call.dealValuePotential > 40000 && (
                          <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-1 rounded">
                            ${(call.dealValuePotential / 1000).toFixed(0)}k ARR
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{call.customerCompany}</div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300 dark:text-slate-300 light:text-slate-700">
                      {call.customerPhone}
                    </td>

                    {/* Agent */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {call.agentAvatar ? (
                          <img
                            src={call.agentAvatar}
                            alt={call.agentName}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">
                          {call.agentName}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                      {call.callDuration}
                    </td>

                    {/* Date / Time */}
                    <td className="py-3.5 px-4 text-slate-400">
                      <div>{call.callDate}</div>
                      <div className="text-[10px] font-mono text-slate-500">{call.callTime}</div>
                    </td>

                    {/* Outcome */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          outcomeColors[call.callOutcome] || 'text-slate-300'
                        }`}
                      >
                        {call.callOutcome}
                      </span>
                    </td>

                    {/* Processing & Review Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          call.reviewStatus === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : call.reviewStatus === 'rejected'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {call.reviewStatus === 'pending' ? 'Review Needed' : call.reviewStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedCallId(call.id);
                        }}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 group-hover:underline"
                      >
                        Inspect AI Analysis →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{filteredCalls.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * itemsPerPage, filteredCalls.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{filteredCalls.length}</span> calls
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono tabular-nums text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Render Drawer if a Call is Selected */}
      {selectedCall && (
        <CallDetailDrawer
          call={selectedCall}
          onClose={() => setSelectedCallId(null)}
        />
      )}
    </div>
  );
};
