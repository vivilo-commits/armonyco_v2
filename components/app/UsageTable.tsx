import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, XCircle, Clock, Activity, Download, RefreshCw } from '../ui/Icons';
import { supabase } from '../../src/lib/supabase';

interface WorkflowExecution {
    id: string;
    created_at: string;
    workflow_name: string;
    status: 'success' | 'failed' | 'running';
    ai_tokens: number;
}

interface UsageTableProps {
    organizationId: string;
    limit?: number;
}

export const UsageTable: React.FC<UsageTableProps> = ({
    organizationId,
    limit = 10
}) => {
    const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalTokens, setTotalTokens] = useState(0);
    const [totalExecutions, setTotalExecutions] = useState(0);

    // Fetch executions from database
    const fetchExecutions = async (isLoadMore = false) => {
        if (!supabase) {
            console.warn('[UsageTable] Supabase not configured');
            setLoading(false);
            return;
        }

        try {
            const currentOffset = isLoadMore ? offset : 0;
            
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            // Fetch executions with pagination
            const { data: executionsData, error: execError } = await supabase
                .from('n8n_executions')
                .select('id, created_at, workflow_name, status, ai_tokens')
                .eq('company_uid', organizationId)
                .order('created_at', { ascending: false })
                .range(currentOffset, currentOffset + limit - 1);

            if (execError) {
                console.error('[UsageTable] Error fetching executions:', execError);
                return;
            }

            // Fetch total count and sum of tokens
            const { count, error: countError } = await supabase
                .from('n8n_executions')
                .select('*', { count: 'exact', head: true })
                .eq('company_uid', organizationId);

            if (!countError) {
                setTotalExecutions(count || 0);
            }

            // Calculate total tokens
            const { data: tokensSum, error: tokensError } = await supabase
                .from('n8n_executions')
                .select('ai_tokens')
                .eq('company_uid', organizationId);

            if (!tokensError && tokensSum) {
                const sum = tokensSum.reduce((acc, curr) => acc + (curr.ai_tokens || 0), 0);
                setTotalTokens(sum);
            }

            // Update state
            if (isLoadMore) {
                setExecutions(prev => [...prev, ...(executionsData || [])]);
                setOffset(currentOffset + limit);
            } else {
                setExecutions(executionsData || []);
                setOffset(limit);
            }

            // Check if there are more records
            setHasMore((executionsData?.length || 0) === limit);

        } catch (error) {
            console.error('[UsageTable] Unexpected error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (organizationId) {
            fetchExecutions();
        }
    }, [organizationId]);

    const handleLoadMore = () => {
        fetchExecutions(true);
    };

    const handleRefresh = () => {
        setOffset(0);
        fetchExecutions(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatTokens = (tokens: number) => {
        return tokens.toLocaleString('de-DE');
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle size={16} className="text-emerald-500" />;
            case 'failed':
                return <XCircle size={16} className="text-red-500" />;
            case 'running':
                return <Clock size={16} className="text-blue-500 animate-pulse" />;
            default:
                return <Activity size={16} className="text-zinc-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'success':
                return <span className="text-emerald-500 font-bold">Success</span>;
            case 'failed':
                return <span className="text-red-500 font-bold">Failed</span>;
            case 'running':
                return <span className="text-blue-500 font-bold">Running</span>;
            default:
                return <span className="text-zinc-500 font-bold">Unknown</span>;
        }
    };

    const avgTokensPerExecution = totalExecutions > 0 
        ? Math.round(totalTokens / totalExecutions) 
        : 0;

    return (
        <div className="space-y-6">
            {/* Section Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 flex items-center justify-center">
                        <Activity size={24} className="text-[var(--color-brand-accent)]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-light text-white">
                            Recent Workflow Executions
                        </h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mt-1">
                            Token consumption & execution history
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-xs text-white/40 uppercase font-black tracking-wider mb-1">
                            Total Executions
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {totalExecutions}
                        </p>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-xs text-white/40 uppercase font-black tracking-wider mb-1">
                            Total Tokens
                        </p>
                        <p className="text-2xl font-bold text-[var(--color-brand-accent)]">
                            {formatTokens(totalTokens)}
                        </p>
                    </div>
                    <div className="w-px h-12 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-xs text-white/40 uppercase font-black tracking-wider mb-1">
                            Avg/Execution
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {formatTokens(avgTokensPerExecution)}
                        </p>
                    </div>
                </div>

                {/* Refresh Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
                    className="text-zinc-400 hover:text-white border border-white/5"
                >
                    Refresh
                </Button>
            </div>

            {/* Table */}
            <Card variant="default" padding="none" className="overflow-hidden border-white/5">
                {loading && executions.length === 0 ? (
                    <div className="p-20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCw size={32} className="text-[var(--color-brand-accent)] animate-spin" />
                            <span className="text-sm text-zinc-400">Loading executions...</span>
                        </div>
                    </div>
                ) : executions.length === 0 ? (
                    <div className="p-20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Activity size={48} className="text-white/10" />
                            <div className="text-center">
                                <p className="text-lg font-bold text-white/60 mb-2">
                                    No Executions Yet
                                </p>
                                <p className="text-sm text-white/40">
                                    Workflow executions will appear here once you start using the system.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                            Workflow
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">
                                            Tokens Used
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {executions.map((execution) => (
                                        <tr
                                            key={execution.id}
                                            className="hover:bg-white/[0.03] transition-all duration-200 group cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors whitespace-nowrap">
                                                {formatDate(execution.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white font-medium tracking-tight opacity-80 group-hover:opacity-100">
                                                {execution.workflow_name || 'Unknown Workflow'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(execution.status)}
                                                    {getStatusText(execution.status)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-bold text-[var(--color-brand-accent)]">
                                                    {formatTokens(execution.ai_tokens || 0)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-center">
                                <Button
                                    variant="ghost"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    isLoading={loadingMore}
                                    className="text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20"
                                >
                                    {loadingMore ? 'Loading...' : 'Load More'}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};
