import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  PhoneCall,
  User,
  ListTodo,
  Workflow,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    calls,
    leads,
    tasks,
    workflows,
    setSelectedCallId,
    setSelectedLeadId,
    setActiveTab,
  } = useCallFlow();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredCalls = cleanQuery
    ? calls.filter(
        c =>
          c.customerName.toLowerCase().includes(cleanQuery) ||
          c.customerCompany.toLowerCase().includes(cleanQuery) ||
          c.agentName.toLowerCase().includes(cleanQuery) ||
          c.summary.toLowerCase().includes(cleanQuery)
      )
    : calls.slice(0, 3);

  const filteredLeads = cleanQuery
    ? leads.filter(
        l =>
          l.name.toLowerCase().includes(cleanQuery) ||
          l.company.toLowerCase().includes(cleanQuery) ||
          l.tags.some(t => t.toLowerCase().includes(cleanQuery))
      )
    : leads.slice(0, 3);

  const filteredTasks = cleanQuery
    ? tasks.filter(
        t =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.customerName.toLowerCase().includes(cleanQuery) ||
          t.assignedAgent.toLowerCase().includes(cleanQuery)
      )
    : tasks.slice(0, 3);

  const filteredWorkflows = cleanQuery
    ? workflows.filter(w => w.name.toLowerCase().includes(cleanQuery))
    : workflows.slice(0, 2);

  const totalResults =
    filteredCalls.length + filteredLeads.length + filteredTasks.length + filteredWorkflows.length;

  const handleSelectCall = (callId: string) => {
    setSelectedCallId(callId);
    setActiveTab('intelligence');
    setIsSearchOpen(false);
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setActiveTab('leads');
    setIsSearchOpen(false);
  };

  const handleSelectTask = () => {
    setActiveTab('tasks');
    setIsSearchOpen(false);
  };

  const handleSelectWorkflow = () => {
    setActiveTab('workflows');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 dark:bg-slate-900 light:bg-white rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search calls, leads, tasks, workflows..."
            className="w-full bg-transparent text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 rounded border border-slate-700/60"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {totalResults === 0 && (
            <div className="py-12 text-center text-slate-500">
              No matching records found for "{query}"
            </div>
          )}

          {/* Calls */}
          {filteredCalls.length > 0 && (
            <div>
              <div className="px-2 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <PhoneCall className="w-3 h-3 text-blue-400" />
                <span>Call Records ({filteredCalls.length})</span>
              </div>
              <div className="space-y-1">
                {filteredCalls.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCall(c.id)}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 truncate">
                          {c.customerName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400 truncate">{c.customerCompany}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Outcome: <span className="text-slate-300">{c.callOutcome}</span> · Agent: {c.agentName}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <div className="px-2 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <User className="w-3 h-3 text-purple-400" />
                <span>Leads & Contacts ({filteredLeads.length})</span>
              </div>
              <div className="space-y-1">
                {filteredLeads.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLead(l.id)}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 truncate">
                          {l.name}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400 truncate">{l.company}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Stage: <span className="text-slate-300">{l.leadStatus}</span> · Value: ${l.dealSizeEstimate.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-2 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <ListTodo className="w-3 h-3 text-emerald-400" />
                <span>Follow-up Tasks ({filteredTasks.length})</span>
              </div>
              <div className="space-y-1">
                {filteredTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={handleSelectTask}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 truncate">
                        {t.title}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        For: {t.customerName} · Assigned to: {t.assignedAgent} · Due: {t.dueDate}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
