export interface Message {
    id: string;
    senderId: string; // 'me' or guest id
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface Conversation {
    id: string; // Standardized to string
    guestName: string;
    guestInitials?: string;
    guestAvatar?: string; // URL
    guestAvatarColor?: string; // Fallback bg class

    propertyName: string;
    dates: string; // Pre-formatted date range
    checkInDate: string;
    checkOutDate: string;

    status: string; // e.g., 'CONFERMATA', 'CHECK IN EFFETTUATO'
    statusColor: 'success' | 'blue' | 'warning' | 'neutral'; // standardized UI intent

    lastMessageTime: string;
    unreadCount: number;

    tags: string[]; // e.g., ['PRENOTAZIONE', 'ACCETTATA']

    hasWhatsapp: boolean;
    hasBooking: boolean;

    messages?: Message[]; // Optional populated messages
}
