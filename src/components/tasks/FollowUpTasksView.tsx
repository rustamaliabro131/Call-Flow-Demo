import React, { useState, useMemo } from 'react';
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { FollowUpTask, TaskPriority, TaskStatus } from '../../types';

export const FollowUpTasksView: React.FC = () => {
  const {
    tasks,
    updateTaskStatus,
    createFollowUpTask,
    deleteTask,
    setSelectedCallId,
    setActiveTab,
  } = useCallFlow();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New task form
  const [newTitle, setNewTitle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newAgent, setNewAgent] = useState('Sarah Jenkins');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newDueDate, setNewDueDate] = useState('2026-11-04');
  const [newActionType, setNewActionType] = useState<FollowUpTask['actionType']>('Call');
  const [newDescription, setNewDescription] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch =
        searchTerm === '' ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedAgent.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchSearch && matchPriority && matchStatus;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCustomer.trim()) return;

    createFollowUpTask({
      title: newTitle,
      customerName: newCustomer,
      customerCompany: newCompany || 'Enterprise Inc',
      assignedAgent: newAgent,
      priority: newPriority,
      dueDate: newDueDate,
      status: 'todo',
      description: newDescription,
      actionType: newActionType,
    });

    setNewTitle('');
    setNewCustomer('');
    setNewCompany('');
    setNewDescription('');
    setIsCreateOpen(false);
  };

  const priorityStyles: Record<TaskPriority, { text: string; bg: string; border: string }> = {
    urgent: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
    },
    high: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    medium: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    low: {
      text: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
    },
  };

  const kanbanColumns: { id: TaskStatus; label: string; count: number }[] = [
    {
      id: 'todo',
      label: 'To Do',
      count: filteredTasks.filter(t => t.status === 'todo').length,
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      count: filteredTasks.filter(t => t.status === 'in_progress').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: filteredTasks.filter(t => t.status === 'completed').length,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <ListTodo className="w-4 h-4" />
            <span>Autonomous Task Dispatch</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Follow-up Tasks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generated and manual follow-up action items created from call transcript analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Kanban / Table view toggle */}
          <div className="flex items-center p-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search task, prospect, agent..."
            className="w-full bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-slate-300"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {viewMode === 'table' && (
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 rounded-lg px-3 py-2 text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>

      {/* View: Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {kanbanColumns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className="p-4 rounded-2xl bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 flex flex-col h-full min-h-[480px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                      {col.label}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-300">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500">
                      No tasks in this stage
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const p = priorityStyles[task.priority];
                      return (
                        <div
                          key={task.id}
                          className="p-4 rounded-xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 hover:border-slate-700 transition-all shadow-xs space-y-2.5 text-xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[10px] uppercase font-semibold font-mono px-2 py-0.5 rounded border ${p.text} ${p.bg} ${p.border}`}
                            >
                              {task.priority}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900 leading-snug">
                            {task.title}
                          </h4>

                          <div className="text-[11px] text-slate-400">
                            Prospect: <span className="text-slate-300">{task.customerName}</span> ({task.customerCompany})
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/50 p-2 rounded">
                              {task.description}
                            </p>
                          )}

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>{task.dueDate}</span>
                            </span>

                            <span className="text-slate-300 font-medium">
                              {task.assignedAgent}
                            </span>
                          </div>

                          {/* Quick stage toggle buttons */}
                          <div className="flex items-center justify-between gap-1 pt-1">
                            {task.relatedCallId && (
                              <button
                                onClick={() => {
                                  setSelectedCallId(task.relatedCallId!);
                                  setActiveTab('intelligence');
                                }}
                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                              >
                                <PhoneCall className="w-2.5 h-2.5" />
                                <span>Call Log</span>
                              </button>
                            )}

                            <div className="ml-auto flex items-center gap-1">
                              {col.id !== 'todo' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'todo')}
                                  className="text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800"
                                >
                                  ← To Do
                                </button>
                              )}
                              {col.id !== 'in_progress' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                  className="text-[10px] text-blue-400 hover:text-blue-300 px-1.5 py-0.5 rounded bg-blue-900/30 hover:bg-blue-900/50"
                                >
                                  In Progress
                                </button>
                              )}
                              {col.id !== 'completed' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'completed')}
                                  className="text-[10px] text-emerald-400 hover:text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-900/30 hover:bg-emerald-900/50"
                                >
                                  Done ✓
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Table List */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Prospect & Company</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(t => {
                    const p = priorityStyles[t.priority];
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                          {t.title}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <div>{t.customerName}</div>
                          <div className="text-[11px] text-slate-500">{t.customerCompany}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${p.text} ${p.bg} ${p.border}`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{t.assignedAgent}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{t.dueDate}</td>
                        <td className="py-3 px-4">
                          <select
                            value={t.status}
                            onChange={e => updateTaskStatus(t.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create New Follow-up Task</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Task Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Deliver custom proposal and schedule POC kickoff"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Customer / Contact</label>
                <input
                  type="text"
                  required
                  value={newCustomer}
                  onChange={e => setNewCustomer(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g. Cyberdyne Inc"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
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
                  value={newActionType}
                  onChange={e => setNewActionType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Demo">Demo</option>
                  <option value="Send Proposal">Send Proposal</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Assigned Agent</label>
              <select
                value={newAgent}
                onChange={e => setNewAgent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="David Chen">David Chen</option>
                <option value="Liam Miller">Liam Miller</option>
                <option value="Alex Morgan">Alex Morgan</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Instructions / Notes</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Include specific call discussion context..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
