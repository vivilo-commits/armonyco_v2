// Simplified chat model for WhatsApp-style conversations
export interface Message {
    id: string;
    senderId: string; // 'me' or 'guest'
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    guestName: string;
    guestPhone: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
}
