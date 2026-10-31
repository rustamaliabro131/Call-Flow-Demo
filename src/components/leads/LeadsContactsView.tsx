import React, { useState, useMemo } from 'react';
import {
  Users2,
  Search,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  X,
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { LeadContact, LeadStatus } from '../../types';

export const LeadsContactsView: React.FC = () => {
  const {
    leads,
    calls,
    tasks,
    selectedLeadId,
    setSelectedLeadId,
    setSelectedCallId,
    setActiveTab,
    updateLeadStage,
  } = useCallFlow();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch =
        searchTerm === '' ||
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'all' || l.leadStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Find related calls & tasks for selected lead
  const leadCalls = selectedLead
    ? calls.filter(
        c =>
          c.customerName.toLowerCase() === selectedLead.name.toLowerCase() ||
          c.customerCompany.toLowerCase() === selectedLead.company.toLowerCase()
      )
    : [];

  const leadTasks = selectedLead
    ? tasks.filter(
        t =>
          t.customerName.toLowerCase() === selectedLead.name.toLowerCase() ||
          t.customerCompany.toLowerCase() === selectedLead.company.toLowerCase()
      )
    : [];

  const statusStyles: Record<LeadStatus, string> = {
    'New Lead': 'text-slate-300 bg-slate-800 border-slate-700',
    Discovery: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Demo Completed': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    Negotiation: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Closed Won': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Unqualified: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Users2 className="w-4 h-4" />
            <span>Account Intelligence</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Leads & Contacts Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Prospect profile directory linked to automated call transcripts and pipeline stages.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, company, email or tag..."
            className="w-full bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-slate-300"
        >
          <option value="all">All Stages</option>
          <option value="New Lead">New Lead</option>
          <option value="Discovery">Discovery</option>
          <option value="Demo Completed">Demo Completed</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Unqualified">Unqualified</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Lead Name & Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Estimated ARR</th>
                <th className="py-3 px-4">Next Follow-up</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{lead.title}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">{lead.company}</td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="font-mono text-[11px] text-slate-300">{lead.phone}</div>
                    <div className="text-[11px] text-slate-500">{lead.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        statusStyles[lead.leadStatus]
                      }`}
                    >
                      {lead.leadStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{lead.assignedAgent}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                    ${lead.dealSizeEstimate.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{lead.nextFollowUpDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-blue-400 group-hover:text-blue-300 font-semibold text-xs">
                      View Account →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sliding Lead Details Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-slate-900 dark:bg-slate-900 light:bg-white border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-400">Lead Profile</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{selectedLead.totalCalls} calls recorded</span>
                </div>
                <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                  {selectedLead.name}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedLead.title} at <span className="text-slate-300">{selectedLead.company}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedLeadId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Account Overview Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Direct Phone</span>
                  <div className="font-mono text-slate-200 mt-0.5">{selectedLead.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Email</span>
                  <div className="text-slate-200 mt-0.5 truncate">{selectedLead.email}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner</span>
                  <div className="text-slate-200 mt-0.5">{selectedLead.assignedAgent}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Target ARR</span>
                  <div className="font-mono font-bold text-emerald-400 mt-0.5">
                    ${selectedLead.dealSizeEstimate.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Stage Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Update Pipeline Stage
                </label>
                <select
                  value={selectedLead.leadStatus}
                  onChange={e => updateLeadStage(selectedLead.id, e.target.value as LeadStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="New Lead">New Lead</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Demo Completed">Demo Completed</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Unqualified">Unqualified</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <span className="text-slate-300 font-semibold block mb-1.5">Account Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <span className="text-slate-300 font-semibold block mb-1">Account Executive Notes</span>
                <p className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedLead.notes}
                </p>
              </div>

              {/* Linked Call Transcripts History */}
              <div>
                <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span>Call History ({leadCalls.length})</span>
                  <span className="text-[10px] text-slate-500">Indexed by CallFlow AI</span>
                </h4>

                <div className="space-y-2">
                  {leadCalls.length === 0 ? (
                    <p className="text-slate-500 italic p-3 border border-dashed border-slate-800 rounded-xl text-center">
                      No call records logged yet for this lead.
                    </p>
                  ) : (
                    leadCalls.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCallId(c.id);
                          setActiveTab('intelligence');
                        }}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{c.callOutcome}</span>
                          <span className="font-mono text-slate-400 text-[11px]">{c.callDuration}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                          {c.summary}
                        </p>
                        <div className="text-[10px] text-blue-400 font-semibold pt-1">
                          Inspect transcript & objections →
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Linked Follow-up Tasks */}
              <div>
                <h4 className="text-xs font-semibold text-slate-200 mb-2">
                  Open Follow-up Tasks ({leadTasks.length})
                </h4>

                <div className="space-y-2">
                  {leadTasks.length === 0 ? (
                    <p className="text-slate-500 italic p-3 border border-dashed border-slate-800 rounded-xl text-center">
                      No active tasks pending.
                    </p>
                  ) : (
                    leadTasks.map(t => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-slate-200">{t.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Due: {t.dueDate} · Status: {t.status}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                          {t.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
