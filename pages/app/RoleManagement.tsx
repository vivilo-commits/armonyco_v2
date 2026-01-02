import React from 'react';
import { Users, Shield, CheckCircle, XCircle } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { UserRole } from '../../src/types';

export const RoleManagement: React.FC = () => {
    // Mock user data
    const users = [
        { id: 1, name: 'Elena Rossi', email: 'e.rossi@armonyco.com', role: UserRole.EXECUTIVE, lastActive: '2m ago' },
        { id: 2, name: 'Marco Verratti', email: 'm.verratti@armonyco.com', role: UserRole.AUDITOR, lastActive: '1h ago' },
        { id: 3, name: 'Sarah Chen', email: 's.chen@armonyco.com', role: UserRole.OPERATOR, lastActive: '4h ago' },
        { id: 4, name: 'David Miller', email: 'd.miller@armonyco.com', role: UserRole.OPERATOR, lastActive: '1d ago' },
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <header className="mb-8 border-b border-[var(--color-border)] pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="text-[var(--color-brand-accent)] w-6 h-6" />
                    <h1 className="text-2xl text-[var(--color-text-main)] font-light">Role Management</h1>
                </div>
                <p className="text-[var(--color-text-muted)] text-sm">Define permissions and access controls.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card padding="md">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-[var(--color-brand-accent)]" size={20} />
                        <h3 className="text-[var(--color-text-main)] font-medium">Executive</h3>
                    </div>
                    <ul className="text-xs text-[var(--color-text-muted)] space-y-2">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-[var(--color-success)]" /> Full System Access</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-[var(--color-success)]" /> Construct Configuration</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-[var(--color-success)]" /> Role Management</li>
                    </ul>
                </Card>
                <Card padding="md">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-[var(--color-text-muted)]" size={20} />
                        <h3 className="text-[var(--color-text-main)] font-medium">Auditor</h3>
                    </div>
                    <ul className="text-xs text-[var(--color-text-muted)] space-y-2">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-[var(--color-success)]" /> Read-Only Logs</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-[var(--color-success)]" /> View Constructs</li>
                        <li className="flex gap-2"><XCircle size={14} className="text-[var(--color-danger)]" /> No Configuration Access</li>
                    </ul>
                </Card>
                <Card padding="md">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-[var(--color-text-muted)]" size={20} />
                        <h3 className="text-[var(--color-text-main)] font-medium">Operator</h3>
                    </div>
                    <ul className="text-xs text-[var(--color-text-muted)] space-y-2">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-[var(--color-success)]" /> Dashboard & Logs</li>
                        <li className="flex gap-2"><XCircle size={14} className="text-[var(--color-danger)]" /> Hidden Constructs</li>
                        <li className="flex gap-2"><XCircle size={14} className="text-[var(--color-danger)]" /> No Admin Tools</li>
                    </ul>
                </Card>
            </div>

            <Card padding="none" className="overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
                    <h3 className="text-[var(--color-text-main)] text-sm font-medium">Active Users</h3>
                </div>
                <table className="w-full text-left text-sm text-[var(--color-text-muted)]">
                    <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] font-medium uppercase text-xs border-b border-[var(--color-border)]">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Last Active</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                <td className="p-4">
                                    <div className="text-[var(--color-text-main)] font-medium">{user.name}</div>
                                    <div className="text-[var(--color-text-muted)] text-xs">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${user.role === UserRole.EXECUTIVE ? 'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] border-[var(--color-brand-accent)]/20' :
                                        user.role === UserRole.AUDITOR ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            'bg-stone-100 text-stone-600 border-stone-200'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-xs">{user.lastActive}</td>
                                <td className="p-4 text-right">
                                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] mr-4 font-medium transition-colors">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};