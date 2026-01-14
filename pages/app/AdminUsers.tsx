import React, { useState, useEffect } from 'react';
import { User, Shield, Ban, CheckCircle, Search, RefreshCw, ChevronDown, AlertCircle } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { adminService, AdminUser } from '../../src/services/admin.service';
import { usePermissions } from '../../src/hooks/usePermissions';
import { UnauthorizedView } from '../../src/components/app/UnauthorizedView';

export const AdminUsersView: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stats, setStats] = useState({ total: 0, active: 0, disabled: 0 });
    
    // Check permissions - only AppAdmin can access this page
    const { isAppAdmin, loading: permissionsLoading, currentOrgRole } = usePermissions();

    // Debug logging
    console.log('==========================================');
    console.log('[AdminUsers] 🔍 PERMISSIONS CHECK');
    console.log('[AdminUsers] ⏳ permissionsLoading:', permissionsLoading);
    console.log('[AdminUsers] 👮 currentOrgRole:', currentOrgRole);
    console.log('[AdminUsers] 🎯 isAppAdmin result:', isAppAdmin);
    console.log('==========================================');

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const [usersData, statsData] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getUserStats(),
            ]);
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setIsUpdating(true);
        try {
            await adminService.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            if (selectedUser?.id === userId) {
                setSelectedUser({ ...selectedUser, role: newRole });
            }
        } catch (error) {
            console.error('Failed to update role:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleToggleDisabled = async (userId: string, currentlyDisabled: boolean) => {
        setIsUpdating(true);
        try {
            await adminService.setUserDisabled(userId, !currentlyDisabled);
            setUsers(users.map(u => u.id === userId ? { ...u, is_disabled: !currentlyDisabled } : u));
            if (selectedUser?.id === userId) {
                setSelectedUser({ ...selectedUser, is_disabled: !currentlyDisabled });
            }
            // Update stats
            const newStats = await adminService.getUserStats();
            setStats(newStats);
        } catch (error) {
            console.error('Failed to toggle status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && !user.is_disabled) ||
            (statusFilter === 'disabled' && user.is_disabled);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Executive': return 'text-[var(--color-brand-accent)] bg-[var(--color-brand-accent)]/10';
            case 'Auditor': return 'text-blue-400 bg-blue-400/10';
            case 'Operator': return 'text-zinc-400 bg-zinc-400/10';
            default: return 'text-zinc-400 bg-zinc-400/10';
        }
    };

    // Show loading while checking permissions
    if (permissionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Only AppAdmin can access this page
    if (!isAppAdmin) {
        console.log('[AdminUsers] ❌ Access denied - not an AppAdmin');
        return (
            <UnauthorizedView 
                message="Solo gli AppAdmin possono gestire gli utenti" 
                title="Accesso Negato"
            />
        );
    }

    console.log('[AdminUsers] ✅ Access granted - user is AppAdmin');

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">User Management</h1>
                    <p className="text-zinc-500 text-sm">Manage platform users, roles, and access</p>
                </div>
                <Button leftIcon={<RefreshCw size={16} />} onClick={loadUsers} isLoading={isLoading}>
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
                <Card variant="dark" padding="lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <User size={24} className="text-zinc-400" />
                        </div>
                    </div>
                </Card>
                <Card variant="dark" padding="lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active</p>
                            <p className="text-3xl font-bold text-emerald-500">{stats.active}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle size={24} className="text-emerald-500" />
                        </div>
                    </div>
                </Card>
                <Card variant="dark" padding="lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Disabled</p>
                            <p className="text-3xl font-bold text-red-500">{stats.disabled}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Ban size={24} className="text-red-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card variant="dark" padding="md" className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[var(--color-brand-accent)]/50"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer"
                >
                    <option value="all">All Roles</option>
                    <option value="Executive">Executive</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Operator">Operator</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                </select>
            </Card>

            {/* Users Table */}
            <Card variant="dark" padding="none" className="overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        <AlertCircle size={32} className="mx-auto mb-4 opacity-50" />
                        <p>No users found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">User</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Role</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Credits</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Status</th>
                                <th className="text-right px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                                                {user.firstName?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={e => handleRoleChange(user.id, e.target.value)}
                                            disabled={isUpdating}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border-0 outline-none cursor-pointer ${getRoleColor(user.role)}`}
                                        >
                                            <option value="Executive">Executive</option>
                                            <option value="Auditor">Auditor</option>
                                            <option value="Operator">Operator</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-white">{user.credits.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.is_disabled
                                                ? 'bg-red-500/10 text-red-400'
                                                : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>
                                            {user.is_disabled ? <Ban size={12} /> : <CheckCircle size={12} />}
                                            {user.is_disabled ? 'Disabled' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleToggleDisabled(user.id, user.is_disabled)}
                                            isLoading={isUpdating}
                                        >
                                            {user.is_disabled ? 'Enable' : 'Disable'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};
