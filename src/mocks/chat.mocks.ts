import { Conversation } from '../models/chat.model';

export const mockConversations: Conversation[] = [
    {
        id: '1',
        guestName: 'Szewczyk Donata',
        guestInitials: 'SD',
        propertyName: 'MUGGIA 21 SUITES',
        dates: '31/12/2025 - 05/01/2026',
        checkInDate: '2025-12-31',
        checkOutDate: '2026-01-05',
        status: 'CONFERMATA',
        statusColor: 'success', // green
        tags: ['PRENOTAZIONE'],
        lastMessageTime: '01h 29m', // relative time for display
        unreadCount: 0,
        guestAvatarColor: 'bg-stone-200',
        hasWhatsapp: true,
        hasBooking: true,
        messages: [
            { id: 'm1', senderId: 'guest', text: 'Hi, is the check-in flexible?', timestamp: '2025-12-30T10:00:00Z', isRead: true },
            { id: 'm2', senderId: 'me', text: 'Yes, we have self check-in available.', timestamp: '2025-12-30T10:05:00Z', isRead: true }
        ]
    },
    {
        id: '2',
        guestName: 'Asia',
        propertyName: 'PIGNETO PATIO APT',
        dates: '01/01/2026 - 07/01/2026',
        checkInDate: '2026-01-01',
        checkOutDate: '2026-01-07',
        status: 'CONFERMATA',
        statusColor: 'success',
        tags: ['PRENOTAZIONE', 'ACCETTATA'],
        lastMessageTime: '01h 13m',
        unreadCount: 2,
        guestAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        hasWhatsapp: false,
        hasBooking: true
    },
    {
        id: '3',
        guestName: 'Kadyrka Kiryll',
        guestInitials: 'KK',
        propertyName: '',
        dates: '24/12/2025 - 28/12/2025',
        checkInDate: '2025-12-24',
        checkOutDate: '2025-12-28',
        status: 'CHECK IN EFFETTUATO',
        statusColor: 'blue',
        tags: ['PRENOTAZIONE'],
        lastMessageTime: '02h 14m',
        unreadCount: 0,
        guestAvatarColor: 'bg-stone-200',
        hasWhatsapp: false,
        hasBooking: true
    },
    {
        id: '4',
        guestName: 'Smolinchuk Vadym',
        guestInitials: 'SV',
        propertyName: '',
        dates: '21/12/2025 - 26/12/2025',
        checkInDate: '2025-12-21',
        checkOutDate: '2025-12-26',
        status: 'CHECK IN EFFETTUATO',
        statusColor: 'blue',
        tags: ['PRENOTAZIONE'],
        lastMessageTime: '02h 41m',
        unreadCount: 0,
        guestAvatarColor: 'bg-stone-200',
        hasWhatsapp: false,
        hasBooking: true
    }
];
