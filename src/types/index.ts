export type CallOutcome = 'Interested' | 'Follow-up Required' | 'Converted' | 'Not Interested' | 'Left Voicemail';
export type ProcessingStatus = 'Completed' | 'Analyzing' | 'Queued' | 'Failed';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type SentimentType = 'positive' | 'neutral' | 'negative';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type LeadStatus = 'New Lead' | 'Discovery' | 'Demo Completed' | 'Negotiation' | 'Closed Won' | 'Unqualified';
export type UserRole = 'Owner' | 'Admin' | 'Manager' | 'Agent';

export interface TranscriptLine {
  id: string;
  speaker: 'Agent' | 'Customer';
  text: string;
  timestamp: string; // e.g. "01:24"
  sentiment?: SentimentType;
  isObjection?: boolean;
  isInterest?: boolean;
}

export interface CrmFieldUpdate {
  key: string;
  label: string;
  currentValue: string;
  suggestedValue: string;
  confidence: number; // 0 - 100
  approved?: boolean;
}

export interface ObjectionItem {
  id: string;
  objection: string;
  quote: string;
  category: 'Price' | 'Timing' | 'Competitor' | 'Authority' | 'Feature' | 'Contract';
  suggestedRebuttal: string;
}

export interface CustomerInterestItem {
  id: string;
  topic: string;
  strength: 'High' | 'Medium' | 'Low';
  details: string;
}

export interface CallRecord {
  id: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  agentName: string;
  agentAvatar?: string;
  callDuration: string; // e.g. "06:45"
  callDurationSeconds: number;
  callDate: string; // "2026-10-30"
  callTime: string; // "14:20"
  callOutcome: CallOutcome;
  processingStatus: ProcessingStatus;
  sentiment: SentimentType;
  sentimentScore: number; // e.g. 84%
  summary: string;
  keyTakeaways: string[];
  interests: CustomerInterestItem[];
  objections: ObjectionItem[];
  suggestedNextSteps: string[];
  crmUpdates: CrmFieldUpdate[];
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  transcript: TranscriptLine[];
  audioWaveformData?: number[];
  dealValuePotential?: number;
}

export interface FollowUpTask {
  id: string;
  title: string;
  customerName: string;
  customerCompany: string;
  assignedAgent: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  relatedCallId?: string;
  description: string;
  actionType: 'Call' | 'Email' | 'Demo' | 'Send Proposal' | 'Contract';
  createdAt: string;
}

export interface LeadContact {
  id: string;
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  leadStatus: LeadStatus;
  assignedAgent: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  totalCalls: number;
  dealSizeEstimate: number;
  notes: string;
  tags: string[];
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'ai_analysis' | 'condition' | 'action' | 'crm' | 'notify';
  title: string;
  subtitle: string;
  status: 'active' | 'idle' | 'running';
  icon: string;
  config?: Record<string, any>;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerEvent: string;
  lastExecution: string;
  successfulRuns: number;
  failedRuns: number;
  nodes: WorkflowNode[];
}

export interface IntegrationCard {
  id: string;
  name: string;
  category: 'CRM' | 'Spreadsheet' | 'Communication' | 'Automation';
  description: string;
  connected: boolean;
  iconName: string;
  lastSync?: string;
  syncedRecordsCount?: number;
  configuredWebhookUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'Active' | 'Invited' | 'Away';
  callsHandledThisMonth: number;
  averageCallDuration: string;
  approvalRate: number; // %
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval_required' | 'task_due' | 'workflow_completed' | 'sync_warning';
  relatedCallId?: string;
}

export interface ActivityLogItem {
  id: string;
  title: string;
  actor: string;
  timestamp: string;
  type: 'approval' | 'rejection' | 'import' | 'task_created' | 'sync';
  meta?: string;
}
