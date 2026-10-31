import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  MoreVertical,
  Check,
  X,
  User,
  Shield,
  Activity,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';
import { UserRole } from '../../types';

export const TeamManagementView: React.FC = () => {
  const { teamMembers, inviteTeamMember } = useCallFlow();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Agent');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    inviteTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      status: 'Invited',
    });

    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const roleColors: Record<UserRole, string> = {
    Owner: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Admin: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Manager: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Agent: 'text-slate-300 bg-slate-800 border-slate-700',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Workforce Management</span>
          </div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
            Team Management & Roles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure member access levels, assign supervisor permissions, and monitor rep activity.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Team Roster Table */}
      <div className="rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role & Access</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Monthly Calls</th>
                <th className="py-3 px-4">Average Call Length</th>
                <th className="py-3 px-4">Manager Approval %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {teamMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{member.email}</div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        roleColors[member.role]
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-medium ${
                        member.status === 'Active'
                          ? 'text-emerald-400'
                          : member.status === 'Invited'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    {member.callsHandledThisMonth} calls
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    {member.averageCallDuration}
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                    {member.approvalRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={handleInviteSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Invite New Team Member</h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                placeholder="e.g. Taylor Reed"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="e.g. taylor@callflow.io"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Role & Permissions</label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Agent">Agent (Can record calls & view assigned tasks)</option>
                <option value="Manager">Manager (Can approve CRM suggestions & view team stats)</option>
                <option value="Admin">Admin (Can configure workflows & integrations)</option>
                <option value="Owner">Owner (Full billing & workspace authority)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="px-3 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
