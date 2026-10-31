import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  CallRecord,
  FollowUpTask,
  LeadContact,
  AutomationWorkflow,
  IntegrationCard,
  TeamMember,
  AppNotification,
  ActivityLogItem,
  CrmFieldUpdate,
  TaskStatus,
  CallOutcome,
} from '../types';
import {
  INITIAL_CALLS,
  INITIAL_TASKS,
  INITIAL_LEADS,
  INITIAL_WORKFLOWS,
  INITIAL_INTEGRATIONS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/mockData';

interface DashboardMetrics {
  totalCalls: number;
  aiAnalysesCompleted: number;
  pendingApprovals: number;
  openTasksCount: number;
  completedTasksCount: number;
  avgDurationFormatted: string;
  totalPipelineValue: number;
  approvalRatePercent: number;
}

interface CallFlowContextType {
  calls: CallRecord[];
  tasks: FollowUpTask[];
  leads: LeadContact[];
  workflows: AutomationWorkflow[];
  integrations: IntegrationCard[];
  teamMembers: TeamMember[];
  notifications: AppNotification[];
  activityLogs: ActivityLogItem[];
  metrics: DashboardMetrics;
  
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCallId: string | null;
  setSelectedCallId: (id: string | null) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;

  // Actions
  approveCallSuggestions: (callId: string, updatedFields?: CrmFieldUpdate[], reviewNotes?: string) => void;
  rejectCallSuggestions: (callId: string, reason: string) => void;
  editCallSuggestions: (callId: string, fields: CrmFieldUpdate[]) => void;
  createFollowUpTask: (task: Omit<FollowUpTask, 'id' | 'createdAt'>) => FollowUpTask;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  importCallsFromCSV: (csvText: string) => number;
  importSingleTranscript: (customerName: string, company: string, agent: string, transcriptText: string, phone?: string) => string;
  toggleWorkflow: (workflowId: string) => void;
  runWorkflowSimulation: (workflowId: string) => Promise<boolean>;
  toggleIntegration: (integrationId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  inviteTeamMember: (member: Omit<TeamMember, 'id' | 'callsHandledThisMonth' | 'averageCallDuration' | 'approvalRate'>) => void;
  updateLeadStage: (leadId: string, newStage: LeadContact['leadStatus']) => void;
  resetDemoData: () => void;
}

const CallFlowContext = createContext<CallFlowContextType | undefined>(undefined);

export const CallFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calls, setCalls] = useState<CallRecord[]>(() => {
    const saved = localStorage.getItem('callflow_calls');
    return saved ? JSON.parse(saved) : INITIAL_CALLS;
  });

  const [tasks, setTasks] = useState<FollowUpTask[]>(() => {
    const saved = localStorage.getItem('callflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [leads, setLeads] = useState<LeadContact[]>(() => {
    const saved = localStorage.getItem('callflow_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(() => {
    const saved = localStorage.getItem('callflow_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [integrations, setIntegrations] = useState<IntegrationCard[]>(() => {
    const saved = localStorage.getItem('callflow_integrations');
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('callflow_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('callflow_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('callflow_activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Dark/Light Theme state: Default to dark as requested for modern enterprise aesthetic
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('callflow_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('callflow_theme', theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('callflow_calls', JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem('callflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('callflow_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('callflow_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('callflow_integrations', JSON.stringify(integrations));
  }, [integrations]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut for Command/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live dashboard metrics
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalCalls = calls.length;
    const aiAnalysesCompleted = calls.filter(c => c.processingStatus === 'Completed').length;
    const pendingApprovals = calls.filter(c => c.reviewStatus === 'pending').length;
    const openTasksCount = tasks.filter(t => t.status !== 'completed').length;
    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

    const totalSeconds = calls.reduce((acc, c) => acc + (c.callDurationSeconds || 300), 0);
    const avgSec = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
    const mins = Math.floor(avgSec / 60);
    const secs = avgSec % 60;
    const avgDurationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const totalPipelineValue = calls.reduce((acc, c) => acc + (c.dealValuePotential || 0), 0);

    const reviewedCalls = calls.filter(c => c.reviewStatus !== 'pending');
    const approvedCalls = calls.filter(c => c.reviewStatus === 'approved');
    const approvalRatePercent =
      reviewedCalls.length > 0 ? Math.round((approvedCalls.length / reviewedCalls.length) * 100) : 100;

    return {
      totalCalls,
      aiAnalysesCompleted,
      pendingApprovals,
      openTasksCount,
      completedTasksCount,
      avgDurationFormatted,
      totalPipelineValue,
      approvalRatePercent,
    };
  }, [calls, tasks]);

  // Core User Journey Action: Approve Suggestions
  const approveCallSuggestions = (callId: string, updatedFields?: CrmFieldUpdate[], reviewNotes?: string) => {
    const targetCall = calls.find(c => c.id === callId);
    if (!targetCall) return;

    // 1. Update Call status & CRM fields
    setCalls(prev =>
      prev.map(call => {
        if (call.id !== callId) return call;
        const newFields = updatedFields || call.crmUpdates.map(f => ({ ...f, approved: true }));
        return {
          ...call,
          reviewStatus: 'approved' as const,
          crmUpdates: newFields,
          reviewedBy: 'Alex Morgan (Manager)',
          reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
          rejectionReason: undefined,
        };
      })
    );

    // 2. Auto-generate follow-up task from first suggested next step
    const firstNextStep = targetCall.suggestedNextSteps[0] || `Follow up with ${targetCall.customerName} on next steps`;
    const newTask: FollowUpTask = {
      id: `task-${Date.now()}`,
      title: firstNextStep.length > 60 ? firstNextStep.slice(0, 57) + '...' : firstNextStep,
      customerName: targetCall.customerName,
      customerCompany: targetCall.customerCompany,
      assignedAgent: targetCall.agentName,
      priority: targetCall.dealValuePotential && targetCall.dealValuePotential > 40000 ? 'urgent' : 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'todo',
      relatedCallId: callId,
      description: `Auto-generated after approval of call with ${targetCall.customerName}.\n${reviewNotes ? 'Manager Note: ' + reviewNotes : ''}`,
      actionType: 'Call',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
    };

    setTasks(prev => [newTask, ...prev]);

    // 3. Sync lead state if present
    setLeads(prev =>
      prev.map(lead => {
        if (lead.name.toLowerCase() === targetCall.customerName.toLowerCase()) {
          return {
            ...lead,
            lastContactDate: new Date().toISOString().split('T')[0],
            totalCalls: lead.totalCalls + 1,
            dealSizeEstimate: targetCall.dealValuePotential || lead.dealSizeEstimate,
          };
        }
        return lead;
      })
    );

    // 4. Add Activity item
    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title: `Approved CRM updates for ${targetCall.customerName} (${targetCall.customerCompany})`,
      actor: 'Alex Morgan (Manager)',
      timestamp: 'Just now',
      type: 'approval',
      meta: `Auto-created task: "${newTask.title}"`,
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    // 5. Mark related notification read
    setNotifications(prev =>
      prev.map(n => (n.relatedCallId === callId ? { ...n, read: true } : n))
    );

    // 6. Celebration Confetti!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#60a5fa', '#10b981', '#6366f1'],
      });
    } catch {
      // Ignore if in headless mode
    }
  };

  // Reject Suggestions
  const rejectCallSuggestions = (callId: string, reason: string) => {
    const targetCall = calls.find(c => c.id === callId);
    if (!targetCall) return;

    setCalls(prev =>
      prev.map(call => {
        if (call.id !== callId) return call;
        return {
          ...call,
          reviewStatus: 'rejected' as const,
          rejectionReason: reason || 'Manager adjusted manual entries.',
          reviewedBy: 'Alex Morgan (Manager)',
          reviewedAt: 'Just now',
        };
      })
    );

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title: `Rejected AI suggestions for ${targetCall.customerName}`,
      actor: 'Alex Morgan (Manager)',
      timestamp: 'Just now',
      type: 'rejection',
      meta: reason,
    };
    setActivityLogs(prev => [newActivity, ...prev]);
  };

  // Edit Suggestions
  const editCallSuggestions = (callId: string, fields: CrmFieldUpdate[]) => {
    setCalls(prev =>
      prev.map(call => {
        if (call.id !== callId) return call;
        return {
          ...call,
          crmUpdates: fields,
        };
      })
    );
  };

  // Create Task
  const createFollowUpTask = (taskData: Omit<FollowUpTask, 'id' | 'createdAt'>): FollowUpTask => {
    const newTask: FollowUpTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
    };
    setTasks(prev => [newTask, ...prev]);

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title: `Created task: ${newTask.title}`,
      actor: 'Sarah Jenkins',
      timestamp: 'Just now',
      type: 'task_created',
      meta: `Assigned to ${newTask.assignedAgent} · Due ${newTask.dueDate}`,
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Core User Journey Step 1: Import CSV
  const importCallsFromCSV = (csvText: string): number => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return 0;

    let addedCount = 0;
    const newCalls: CallRecord[] = [];

    // Simple robust parser handling quotes
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by comma outside quotes
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      const cleanCols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());

      const callId = cleanCols[0] || `CF-IMP-${Date.now()}-${i}`;
      const customerName = cleanCols[1] || 'Imported Prospect';
      const company = cleanCols[2] || 'Enterprise Corp';
      const phone = cleanCols[3] || '+1 (555) 019-8234';
      const agent = cleanCols[4] || 'Sarah Jenkins';
      const duration = cleanCols[5] || '06:30';
      const outcome = (cleanCols[6] as CallOutcome) || 'Follow-up Required';
      const transcriptText = cleanCols[7] || line;

      // Deterministic synthetic analysis based on transcript contents
      const lower = transcriptText.toLowerCase();
      const isPositive = lower.includes('ready') || lower.includes('fantastic') || lower.includes('switch') || lower.includes('loved');
      const isNegative = lower.includes('zero interest') || lower.includes('killing our margins') || lower.includes('concerns');
      const sentiment = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';
      const sentimentScore = isPositive ? 86 : isNegative ? 34 : 65;

      const newRecord: CallRecord = {
        id: `call-imp-${Date.now()}-${i}`,
        customerName,
        customerCompany: company,
        customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        customerPhone: phone,
        agentName: agent,
        agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        callDuration: duration,
        callDurationSeconds: 390,
        callDate: new Date().toISOString().split('T')[0],
        callTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        callOutcome: outcome,
        processingStatus: 'Completed',
        sentiment,
        sentimentScore,
        dealValuePotential: isPositive ? 48000 : 15000,
        summary: `Imported call transcript analysis: ${customerName} discussed operational integration with ${company}. Key discussion centered on latency, compatibility with existing systems, and pricing models. Follow-up action proposed.`,
        keyTakeaways: [
          `Prospect verified current vendor pain points with ${company}.`,
          'Requested technical documentation and architecture reference.',
          'Evaluation team to review prototype next week.',
        ],
        interests: [
          {
            id: `int-${Date.now()}-${i}`,
            topic: 'System Compatibility & API Throughput',
            strength: 'High',
            details: 'Requested benchmark numbers and connector diagrams.',
          },
        ],
        objections: isNegative
          ? [
              {
                id: `obj-${Date.now()}-${i}`,
                objection: 'Internal Build Preference / Pricing',
                quote: 'Evaluated internal options before taking external vendor call.',
                category: 'Price',
                suggestedRebuttal: 'Demonstrate total cost of ownership (TCO) advantage.',
              },
            ]
          : [],
        suggestedNextSteps: [
          `Email technical architecture packet to ${customerName}.`,
          `Book 30-minute validation demo with engineering leads.`,
        ],
        crmUpdates: [
          {
            key: 'deal_stage',
            label: 'Deal Stage',
            currentValue: 'Lead Intake',
            suggestedValue: isPositive ? 'Solution Review' : 'Discovery Completed',
            confidence: 93,
            approved: false,
          },
          {
            key: 'projected_arr',
            label: 'Projected ARR',
            currentValue: '$0',
            suggestedValue: isPositive ? '$48,000' : '$15,000',
            confidence: 88,
            approved: false,
          },
          {
            key: 'next_step',
            label: 'Next Action Item',
            currentValue: 'None',
            suggestedValue: 'Send Technical Spec Sheet',
            confidence: 96,
            approved: false,
          },
        ],
        reviewStatus: 'pending',
        audioWaveformData: [25, 40, 60, 45, 80, 70, 85, 60, 50, 65, 40, 20],
        transcript: [
          {
            id: `tl-1-${i}`,
            speaker: 'Agent',
            timestamp: '00:05',
            text: `Hi ${customerName}, connecting from CallFlow AI regarding your outbound evaluation.`,
          },
          {
            id: `tl-2-${i}`,
            speaker: 'Customer',
            timestamp: '00:20',
            text: transcriptText,
            sentiment,
          },
        ],
      };

      newCalls.push(newRecord);
      addedCount++;
    }

    if (newCalls.length > 0) {
      setCalls(prev => [...newCalls, ...prev]);

      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        title: `Imported CSV Batch (${addedCount} calls processed)`,
        actor: 'Alex Morgan',
        timestamp: 'Just now',
        type: 'import',
        meta: 'AI analysis completed across all records',
      };
      setActivityLogs(prev => [newActivity, ...prev]);

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `${addedCount} New Calls Imported`,
        message: 'Batch uploaded from CSV. AI analysis and CRM suggestions ready for review.',
        timestamp: 'Just now',
        read: false,
        type: 'approval_required',
        relatedCallId: newCalls[0].id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return addedCount;
  };

  // Import raw transcript text
  const importSingleTranscript = (
    customerName: string,
    company: string,
    agent: string,
    transcriptText: string,
    phone?: string
  ): string => {
    const callId = `call-text-${Date.now()}`;
    const newCall: CallRecord = {
      id: callId,
      customerName,
      customerCompany: company,
      customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      customerPhone: phone || '+1 (555) 782-9901',
      agentName: agent,
      agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      callDuration: '05:45',
      callDurationSeconds: 345,
      callDate: new Date().toISOString().split('T')[0],
      callTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callOutcome: 'Interested',
      processingStatus: 'Completed',
      sentiment: 'positive',
      sentimentScore: 90,
      dealValuePotential: 36000,
      summary: `Automated AI analysis of submitted transcript for ${customerName} (${company}). Identified immediate requirements for workflow automation, objection handling, and CRM synchronization.`,
      keyTakeaways: [
        `Identified clear purchase intent from ${customerName}.`,
        'Needs integration into existing CRM ecosystem.',
        'Requested prompt proposal delivery.',
      ],
      interests: [
        {
          id: `int-${Date.now()}`,
          topic: 'Sales Workflow Automation',
          strength: 'High',
          details: 'Eliminate manual post-call documentation across sales team.',
        },
      ],
      objections: [],
      suggestedNextSteps: [
        `Deliver commercial proposal to ${customerName}.`,
        'Schedule implementation scoping session.',
      ],
      crmUpdates: [
        {
          key: 'deal_stage',
          label: 'Deal Stage',
          currentValue: 'Intake',
          suggestedValue: 'Qualified Opportunity',
          confidence: 95,
          approved: false,
        },
        {
          key: 'deal_value',
          label: 'Estimated ARR',
          currentValue: '$0',
          suggestedValue: '$36,000',
          confidence: 90,
          approved: false,
        },
      ],
      reviewStatus: 'pending',
      audioWaveformData: [20, 45, 60, 75, 80, 65, 70, 85, 60, 45, 30],
      transcript: transcriptText
        .split('\n')
        .filter(l => l.trim().length > 0)
        .map((line, idx) => ({
          id: `tl-p-${idx}`,
          speaker: line.toLowerCase().startsWith('customer:') ? 'Customer' : 'Agent',
          text: line.replace(/^(Agent|Customer):\s*/i, ''),
          timestamp: `0${Math.floor(idx / 2)}:${((idx * 20) % 60).toString().padStart(2, '0')}`,
        })),
    };

    setCalls(prev => [newCall, ...prev]);

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title: `Processed Raw Transcript for ${customerName}`,
      actor: agent,
      timestamp: 'Just now',
      type: 'import',
      meta: 'AI summary and suggestions generated',
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    return callId;
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev =>
      prev.map(w => (w.id === workflowId ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const runWorkflowSimulation = async (workflowId: string): Promise<boolean> => {
    // Step through nodes
    setWorkflows(prev =>
      prev.map(w => {
        if (w.id !== workflowId) return w;
        return {
          ...w,
          nodes: w.nodes.map((node, i) => ({
            ...node,
            status: i === 0 ? 'running' : 'idle',
          })),
        };
      })
    );

    // Simulate async pipeline completion
    await new Promise(resolve => setTimeout(resolve, 800));

    setWorkflows(prev =>
      prev.map(w => {
        if (w.id !== workflowId) return w;
        return {
          ...w,
          successfulRuns: w.successfulRuns + 1,
          lastExecution: 'Just now',
          nodes: w.nodes.map(node => ({
            ...node,
            status: 'active',
          })),
        };
      })
    );

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title: `Executed Automation Workflow #${workflowId}`,
      actor: 'System Automation',
      timestamp: 'Just now',
      type: 'sync',
      meta: 'All pipeline stages passed with 0 errors',
    };
    setActivityLogs(prev => [newActivity, ...prev]);

    return true;
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id !== integrationId) return item;
        const nextConnected = !item.connected;
        return {
          ...item,
          connected: nextConnected,
          lastSync: nextConnected ? 'Just now' : undefined,
          syncedRecordsCount: nextConnected ? 1240 : 0,
        };
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const inviteTeamMember = (memberData: Omit<TeamMember, 'id' | 'callsHandledThisMonth' | 'averageCallDuration' | 'approvalRate'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `user-${Date.now()}`,
      callsHandledThisMonth: 0,
      averageCallDuration: '00:00',
      approvalRate: 100,
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateLeadStage = (leadId: string, newStage: LeadContact['leadStatus']) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, leadStatus: newStage } : l))
    );
  };

  const resetDemoData = () => {
    setCalls(INITIAL_CALLS);
    setTasks(INITIAL_TASKS);
    setLeads(INITIAL_LEADS);
    setWorkflows(INITIAL_WORKFLOWS);
    setIntegrations(INITIAL_INTEGRATIONS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
  };

  return (
    <CallFlowContext.Provider
      value={{
        calls,
        tasks,
        leads,
        workflows,
        integrations,
        teamMembers,
        notifications,
        activityLogs,
        metrics,
        activeTab,
        setActiveTab,
        selectedCallId,
        setSelectedCallId,
        selectedLeadId,
        setSelectedLeadId,
        theme,
        toggleTheme,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isHelpOpen,
        setIsHelpOpen,
        approveCallSuggestions,
        rejectCallSuggestions,
        editCallSuggestions,
        createFollowUpTask,
        updateTaskStatus,
        deleteTask,
        importCallsFromCSV,
        importSingleTranscript,
        toggleWorkflow,
        runWorkflowSimulation,
        toggleIntegration,
        markNotificationAsRead,
        clearAllNotifications,
        inviteTeamMember,
        updateLeadStage,
        resetDemoData,
      }}
    >
      {children}
    </CallFlowContext.Provider>
  );
};

export const useCallFlow = () => {
  const context = useContext(CallFlowContext);
  if (!context) {
    throw new Error('useCallFlow must be used within a CallFlowProvider');
  }
  return context;
};
