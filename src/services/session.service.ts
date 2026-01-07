import { supabase, getCurrentUser } from '../lib/supabase';

export interface UserSession {
    id: string;
    user_id: string;
    ip_address: string;
    user_agent: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    os: string;
    country?: string;
    city?: string;
    is_current: boolean;
    created_at: string;
    last_active_at: string;
}

/**
 * Parse user agent to extract device info
 */
function parseUserAgent(ua: string): { deviceType: string; browser: string; os: string } {
    // Device type
    let deviceType = 'desktop';
    if (/mobile/i.test(ua)) deviceType = 'mobile';
    else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

    // Browser
    let browser = 'Unknown';
    if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) browser = 'Chrome';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/edge|edg/i.test(ua)) browser = 'Edge';
    else if (/opera|opr/i.test(ua)) browser = 'Opera';

    // OS
    let os = 'Unknown';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/mac os/i.test(ua)) os = 'macOS';
    else if (/linux/i.test(ua)) os = 'Linux';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

    return { deviceType, browser, os };
}

/**
 * Create a new session record
 */
export async function createSession(): Promise<UserSession | null> {
    if (!supabase) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    const ua = navigator.userAgent;
    const { deviceType, browser, os } = parseUserAgent(ua);

    // Get IP from external service (optional - can be done server-side)
    let ipAddress = 'Unknown';
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip || 'Unknown';
    } catch {
        ipAddress = 'Unknown';
    }

    // First, mark all other sessions as not current
    await supabase
        .from('user_sessions')
        .update({ is_current: false })
        .eq('user_id', user.id);

    // Create new session
    const { data, error } = await supabase
        .from('user_sessions')
        .insert({
            user_id: user.id,
            ip_address: ipAddress,
            user_agent: ua,
            device_type: deviceType,
            browser,
            os,
            is_current: true,
        })
        .select()
        .single();

    if (error) {
        console.error('[Session] Create failed:', error);
        return null;
    }

    return data as UserSession;
}

/**
 * Get all sessions for current user
 */
export async function getSessions(): Promise<UserSession[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active_at', { ascending: false });

    if (error) {
        console.error('[Session] Get sessions failed:', error);
        return [];
    }

    return (data as UserSession[]) || [];
}

/**
 * Update last active timestamp for current session
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
    if (!supabase) return;

    await supabase
        .from('user_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', sessionId);
}

/**
 * Delete a specific session (logout from device)
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) {
        console.error('[Session] Delete failed:', error);
        return false;
    }

    return true;
}

/**
 * Delete all sessions except current (logout from all other devices)
 */
export async function deleteOtherSessions(): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('is_current', false);

    if (error) {
        console.error('[Session] Delete others failed:', error);
        return false;
    }

    return true;
}

/**
 * Delete all sessions (full logout from all devices)
 */
export async function deleteAllSessions(): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        console.error('[Session] Delete all failed:', error);
        return false;
    }

    return true;
}

export const sessionService = {
    createSession,
    getSessions,
    updateSessionActivity,
    deleteSession,
    deleteOtherSessions,
    deleteAllSessions,
};
