import React from 'react';
import { Users, Shield, CheckCircle, XCircle } from '../../components/ui/Icons';
import { UserRole } from '../../types';

export const RoleManagement: React.FC = () => {
    // Mock user data
    const users = [
        { id: 1, name: 'Elena Rossi', email: 'e.rossi@armonyco.com', role: UserRole.EXECUTIVE, lastActive: '2m ago' },
        { id: 2, name: 'Marco Verratti', email: 'm.verratti@armonyco.com', role: UserRole.AUDITOR, lastActive: '1h ago' },
        { id: 3, name: 'Sarah Chen', email: 's.chen@armonyco.com', role: UserRole.OPERATOR, lastActive: '4h ago' },
        { id: 4, name: 'David Miller', email: 'd.miller@armonyco.com', role: UserRole.OPERATOR, lastActive: '1d ago' },
    ];

    return (
        <div className="p-8 animate-fade-in">
            <header className="mb-8 border-b border-stone-200 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="text-armonyco-gold w-6 h-6" />
                    <h1 className="text-2xl text-stone-900 font-light">Role Management</h1>
                </div>
                <p className="text-stone-500 text-sm">Define permissions and access controls.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="ui-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-armonyco-gold" size={20} />
                        <h3 className="text-stone-900 font-medium">Executive</h3>
                    </div>
                    <ul className="text-xs text-stone-500 space-y-2">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-emerald-500" /> Full System Access</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-emerald-500" /> Construct Configuration (AEM/AOS/ARS)</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-emerald-500" /> Role Management</li>
                    </ul>
                </div>
                <div className="ui-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-stone-400" size={20} />
                        <h3 className="text-stone-900 font-medium">Auditor</h3>
                    </div>
                     <ul className="text-xs text-stone-500 space-y-2">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-emerald-500" /> Read-Only Logs & Ledgers</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-emerald-500" /> View Constructs</li>
                        <li className="flex gap-2"><XCircle size={14} className="text-red-500" /> No Configuration Access</li>
                    </ul>
                </div>
                <div className="ui-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="text-stone-400" size={20} />
                        <h3 className="text-stone-900 font-medium">Operator</h3>
                    </div>
                     <ul className="text-xs text-stone-500 space-y-2">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-emerald-500" /> Dashboard & Logs</li>
                        <li className="flex gap-2"><XCircle size={14} className="text-red-500" /> Hidden Constructs</li>
                        <li className="flex gap-2"><XCircle size={14} className="text-red-500" /> No Administrative Tools</li>
                    </ul>
                </div>
            </div>

            <div className="ui-card p-0 overflow-hidden">
                <div className="p-4 border-b border-stone-200 bg-stone-50">
                    <h3 className="text-stone-900 text-sm font-medium">Active Users</h3>
                </div>
                <table className="w-full text-left text-sm text-stone-500">
                    <thead className="bg-white text-stone-500 font-medium uppercase text-xs border-b border-stone-100">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Last Active</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                                <td className="p-4">
                                    <div className="text-stone-900 font-medium">{user.name}</div>
                                    <div className="text-stone-500 text-xs">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                                        user.role === UserRole.EXECUTIVE ? 'bg-armonyco-gold/10 text-armonyco-gold border-armonyco-gold/20' :
                                        user.role === UserRole.AUDITOR ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-stone-100 text-stone-600 border-stone-200'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-xs">{user.lastActive}</td>
                                <td className="p-4 text-right">
                                    <button className="text-stone-400 hover:text-stone-900 mr-4">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};