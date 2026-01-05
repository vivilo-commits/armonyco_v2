import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from '../../../components/ui/Icons';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Core Governance Exception:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8 font-sans text-white">
                    <div className="max-w-md w-full text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                <AlertTriangle size={48} strokeWidth={1} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-[#050505] animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-2xl font-light tracking-[0.2em] uppercase">System Compromised</h1>
                            <p className="text-zinc-500 text-sm leading-relaxed italic">
                                A critical exception occurred in the governance routine. Decryption streams have been halted to maintain ledger integrity.
                            </p>
                        </div>

                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-mono text-red-400/60 break-all text-left">
                            <span className="text-zinc-600 block mb-1 uppercase tracking-widest font-black">Trace Identity:</span>
                            {this.state.error?.message || 'Unknown Runtime Exception'}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white/5 hover:bg-white/10 w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.1)] border border-white/10"
                        >
                            <RefreshCw size={16} />
                            Restart Governance Stream
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
