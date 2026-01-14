import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePermissions } from '../../hooks/usePermissions';
import { Building, Users, CreditCard, TrendingUp, AlertCircle, ChevronLeft } from '../../../components/ui/Icons';

interface Organization {
  id: string;
  name: string;
  tier: string;
  user_id: string;
  created_at: string;
}

interface Stats {
  totalOrgs: number;
  totalUsers: number;
  activeSubscriptions: number;
}

interface Member {
  id: string;
  role: string;
  created_at: string;
  profiles: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
  };
}

export default function SuperAdminDashboard() {
  const { isAppAdmin } = usePermissions();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list'); // View mode: list or detail
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgMembers, setOrgMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrgs: 0,
    totalUsers: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (!isAppAdmin) return;
    loadData();
  }, [isAppAdmin]);

  async function loadData() {
    try {
      setLoading(true);
      console.log('[SuperAdminDashboard] 📊 Loading global statistics...');

      // Load all organizations
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (orgsError) {
        console.error('[SuperAdminDashboard] ❌ Error loading organizations:', orgsError);
      } else {
        setOrganizations(orgs || []);
        console.log('[SuperAdminDashboard] ✅ Loaded', orgs?.length || 0, 'organizations');
      }

      // Load global statistics
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: orgCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true });

      // TODO: Add subscription count when implemented
      const activeSubscriptions = 0;

      setStats({
        totalOrgs: orgCount || 0,
        totalUsers: userCount || 0,
        activeSubscriptions,
      });

      console.log('[SuperAdminDashboard] ✅ Stats loaded:', {
        orgs: orgCount,
        users: userCount,
      });
    } catch (err) {
      console.error('[SuperAdminDashboard] ❌ Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Load organization members
  async function loadOrganizationMembers(orgId: string) {
    try {
      setLoadingMembers(true);
      console.log('[SuperAdminDashboard] 👥 Loading members for org:', orgId);

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          role,
          created_at,
          profiles:user_id (
            id,
            email,
            first_name,
            last_name,
            role
          )
        `)
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SuperAdminDashboard] ❌ Error loading members:', error);
        setOrgMembers([]);
      } else {
        setOrgMembers(data || []);
        console.log('[SuperAdminDashboard] ✅ Loaded', data?.length || 0, 'members');
      }
    } catch (err) {
      console.error('[SuperAdminDashboard] ❌ Error loading members:', err);
      setOrgMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }

  // View organization details
  function viewOrganizationDetails(org: Organization) {
    setSelectedOrg(org);
    setViewMode('detail');
    loadOrganizationMembers(org.id);
  }

  // Back to list
  function backToList() {
    setViewMode('list');
    setSelectedOrg(null);
    setOrgMembers([]);
  }

  if (!isAppAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Accesso Negato</h1>
          <p className="text-gray-600">Solo i Super Admin possono accedere a questa pagina.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ===== DETAIL VIEW: Organization Members =====
  if (viewMode === 'detail' && selectedOrg) {
    return (
      <div className="p-8 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={backToList}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Torna alle organizzazioni</span>
        </button>

        {/* Organization Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🏢</div>
            <div>
              <h1 className="text-3xl font-bold text-white">{selectedOrg.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium">
                  {selectedOrg.tier}
                </span>
                <span className="text-gray-400 text-sm">
                  {orgMembers.length} {orgMembers.length === 1 ? 'membro' : 'membri'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Membri dell'Organizzazione</h2>
          </div>

          {loadingMembers ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : orgMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nessun membro in questa organizzazione</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 text-left">
                  <tr>
                    <th className="px-6 py-3 text-gray-400 font-medium">Utente</th>
                    <th className="px-6 py-3 text-gray-400 font-medium">Email</th>
                    <th className="px-6 py-3 text-gray-400 font-medium">Ruolo Org</th>
                    <th className="px-6 py-3 text-gray-400 font-medium">Ruolo App</th>
                    <th className="px-6 py-3 text-gray-400 font-medium">Aggiunto il</th>
                  </tr>
                </thead>
                <tbody>
                  {orgMembers.map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== LIST VIEW: All Organizations =====
  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👑</span>
          <h1 className="text-3xl font-bold text-white">Administration</h1>
        </div>
        <p className="text-gray-400">Gestione completa del sistema - Solo Super Admin</p>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Organizzazioni Totali"
          value={stats.totalOrgs}
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Utenti Totali"
          value={stats.totalUsers}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Abbonamenti Attivi"
          value={stats.activeSubscriptions}
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Organizations List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Tutte le Organizzazioni</h2>
          <p className="text-gray-400 text-sm mt-1">
            Clicca su un'organizzazione per vedere i membri
          </p>
        </div>

        {organizations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Building size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nessuna organizzazione presente nel sistema</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 text-left">
                <tr>
                  <th className="px-6 py-3 text-gray-400 font-medium">Nome Organizzazione</th>
                  <th className="px-6 py-3 text-gray-400 font-medium">Tier</th>
                  <th className="px-6 py-3 text-gray-400 font-medium">Creata il</th>
                  <th className="px-6 py-3 text-gray-400 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <OrganizationRow
                    key={org.id}
                    org={org}
                    onViewDetails={() => viewOrganizationDetails(org)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: 'blue' | 'green' | 'purple';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-emerald-400',
    purple: 'text-purple-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border rounded-xl p-6`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
        </div>
        <div className={`${iconColorClasses[color]} opacity-80`}>
          <Icon size={40} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

interface OrganizationRowProps {
  org: Organization;
  onViewDetails: () => void;
}

function OrganizationRow({ org, onViewDetails }: OrganizationRowProps) {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    loadMemberCount();
  }, [org.id]);

  async function loadMemberCount() {
    try {
      const { count } = await supabase
        .from('organization_members')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', org.id);

      setMemberCount(count || 0);
    } catch (err) {
      console.error('[OrganizationRow] Error loading member count:', err);
      setMemberCount(0);
    }
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏢</span>
          <span className="text-white font-medium">{org.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
          {org.tier}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-400 text-sm">
          {new Date(org.created_at).toLocaleDateString('it-IT')}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={onViewDetails}
          className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
        >
          Vedi Membri {memberCount !== null && `(${memberCount})`}
        </button>
      </td>
    </tr>
  );
}

interface MemberRowProps {
  member: Member;
}

function MemberRow({ member }: MemberRowProps) {
  const profile = member.profiles;

  // Badge color for org role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'User':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Collaborator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const userInitial = profile.first_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || '?';

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {userInitial}
          </div>
          <span className="text-white font-medium">
            {profile.first_name && profile.last_name 
              ? `${profile.first_name} ${profile.last_name}` 
              : profile.email}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-400 text-sm">{profile.email}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
          {member.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-400 text-sm">{profile.role || 'User'}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-400 text-sm">
          {new Date(member.created_at).toLocaleDateString('it-IT')}
        </span>
      </td>
    </tr>
  );
}
