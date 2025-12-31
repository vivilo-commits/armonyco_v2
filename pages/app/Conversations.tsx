import React from 'react';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Phone, 
    Video, 
    CheckCircle, 
    MessageCircle, 
    Home, 
    CreditCard, 
    Info, 
    MapPin, 
    Calendar,
    User
} from '../../components/ui/Icons';
import { FloatingInput } from '../../components/ui/FloatingInput';

// Mock Data for Conversation List
const conversations = [
    {
        id: 1,
        guest: 'Szewczyk Donata',
        property: 'MUGGIA 21 SUITES',
        dates: '31/12/2025 - 05/01/2026',
        status: 'CONFERMATA',
        statusType: 'success', // green
        tag: 'PRENOTAZIONE',
        time: '01h 29m',
        avatarColor: 'bg-stone-200',
        initials: 'SD',
        hasWhatsapp: true
    },
    {
        id: 2,
        guest: 'Asia',
        property: 'PIGNETO PATIO APT',
        dates: '01/01/2026 - 07/01/2026',
        status: 'CONFERMATA',
        statusType: 'success',
        tag: 'PRENOTAZIONE - ACCETTATA',
        time: '01h 13m',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        hasWhatsapp: false,
        notification: 2
    },
    {
        id: 3,
        guest: 'Kadyrka Kiryll',
        property: '',
        dates: '24/12/2025 - 28/12/2025',
        status: 'CHECK IN EFFETTUATO',
        statusType: 'blue',
        tag: 'PRENOTAZIONE',
        time: '02h 14m',
        initials: 'KK',
        avatarColor: 'bg-stone-200',
        hasBooking: true
    },
    {
        id: 4,
        guest: 'Smolinchuk Vadym',
        property: '',
        dates: '21/12/2025 - 26/12/2025',
        status: 'CHECK IN EFFETTUATO',
        statusType: 'blue',
        tag: 'PRENOTAZIONE',
        time: '02h 41m',
        initials: 'SV',
        avatarColor: 'bg-stone-200',
        hasBooking: true
    }
];

export const ConversationsView: React.FC = () => {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-stone-50 border-t border-stone-200 animate-fade-in">
            
            {/* LEFT PANE: LIST */}
            <div className="w-80 border-r border-stone-200 flex flex-col bg-white shrink-0">
                <div className="p-4 border-b border-stone-100 space-y-4">
                    <h2 className="text-xl font-light text-stone-900">Messages</h2>
                    <div className="flex gap-2 items-center">
                        <div className="flex-1">
                            <FloatingInput 
                                label="Search guest..." 
                                startIcon={<Search size={16} />}
                            />
                        </div>
                        <button className="p-3 ui-btn-secondary h-[52px] w-[52px] flex items-center justify-center rounded-xl border border-stone-200">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div key={conv.id} className={`p-4 border-b border-stone-100 cursor-pointer transition-colors relative group ${conv.id === 1 ? 'bg-stone-50 border-l-4 border-l-stone-900' : 'border-l-4 border-l-transparent hover:bg-stone-50'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {conv.image ? (
                                            <img src={conv.image} alt={conv.guest} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full ${conv.avatarColor} flex items-center justify-center text-stone-600 font-bold text-xs shadow-inner`}>
                                                {conv.initials}
                                            </div>
                                        )}
                                        {conv.hasWhatsapp && (
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                                                <MessageCircle size={10} className="text-white fill-current" />
                                            </div>
                                        )}
                                        {conv.hasBooking && (
                                            <div className="absolute -bottom-1 -right-1 bg-[#003580] rounded-full p-0.5 border-2 border-white flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white">
                                                B.
                                            </div>
                                        )}
                                        {conv.notification && (
                                            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                                {conv.notification}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-stone-900">{conv.guest}</h3>
                                        {conv.property && (
                                            <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5">
                                                <Home size={10} /> {conv.property}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[10px] text-stone-400 font-medium">{conv.time}</span>
                            </div>

                            <div className="pl-[52px]">
                                <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-2">
                                    <Calendar size={10} /> {conv.dates}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-stone-100 text-stone-600 text-[9px] font-bold px-2 py-1 rounded uppercase border border-stone-200">
                                        {conv.tag}
                                    </span>
                                    {conv.status && (
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase ${
                                            conv.statusType === 'success' 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                            {conv.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CENTER PANE: CHAT */}
            <div className="flex-1 flex flex-col bg-[#F9FAF9] relative">
                {/* Chat Header */}
                <div className="h-16 border-b border-stone-200 bg-white/80 backdrop-blur flex justify-between items-center px-6 shrink-0 z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-[#C5A572] font-bold text-xs shadow-sm">
                            SD
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-stone-900">Szewczyk Donata</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs text-stone-500">Active via whatsapp</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
                            <Phone size={18} />
                        </button>
                        <button className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
                            <Video size={18} />
                        </button>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col">
                    
                    <div className="flex justify-center mb-6">
                        <span className="bg-white border border-stone-200 px-3 py-1 rounded-full text-[10px] font-bold text-stone-400 uppercase tracking-wider shadow-sm">
                            Oggi
                        </span>
                    </div>

                    {/* Meta Disclaimer */}
                    <div className="bg-[#FFF8E1] border border-[#FFE0B2] text-[#F57C00] text-xs p-3 rounded-lg text-center mb-8 max-w-lg mx-auto w-full shadow-sm">
                        Questa azienda usa un servizio sicuro di Meta per gestire questa chat. Tocca per saperne di più.
                    </div>

                    {/* Message Bubble - Agent */}
                    <div className="self-end max-w-md mb-6 relative group animate-slide-up">
                        <div className="text-[9px] font-bold text-[#C5A572] uppercase tracking-widest mb-1 text-right">Amelia AI</div>
                        <div className="flex gap-3 justify-end">
                            <div className="bg-[#151514] text-white p-4 rounded-2xl rounded-tr-sm shadow-md text-sm leading-relaxed ui-card-dark border-none">
                                <p>Para poder ayudarte con tu reserva necesito verificar un segundo dato.</p>
                                <p className="mt-2">¿Podrías confirmarme, por favor, la fecha de llegada o el número de noches de tu estancia? Así podré localizar tu reserva correctamente. Muchas gracias.</p>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                                alt="Agent" 
                                className="w-8 h-8 rounded-full border-2 border-white shadow-md mt-auto"
                            />
                        </div>
                        <div className="text-[10px] text-stone-400 text-right mt-1 mr-12">15:38</div>
                    </div>

                </div>

                {/* Chat Input Area (Visual only) */}
                <div className="p-4 bg-white border-t border-stone-200">
                    <div className="relative">
                        <FloatingInput 
                            label="Type a message..."
                        />
                        <button className="absolute right-2 top-2 p-1.5 bg-stone-900 text-white rounded hover:bg-stone-700 transition-colors shadow-sm h-[38px] w-[38px] flex items-center justify-center mt-0.5">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT PANE: DETAILS */}
            <div className="w-80 border-l border-stone-200 bg-white shrink-0 overflow-y-auto">
                <div className="p-6">
                    {/* Guest Card */}
                    <div className="ui-card p-4 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-[#003580] rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                B.
                            </div>
                            <CheckCircle size={18} className="text-emerald-500" />
                        </div>
                        
                        <div className="mb-1">
                            <div className="text-[10px] text-stone-400 font-mono">17722/2025</div>
                            <h3 className="text-base font-bold text-stone-900">Szewczyk Donata...</h3>
                            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                                <User size={12} /> 1 <span className="text-stone-300">|</span> 5 Guests
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-100 rounded-lg hover:border-stone-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="text-stone-400"><MoreHorizontal size={14} className="rotate-45" /></div>
                                <span className="text-xs font-bold text-stone-700">Mer 31/12/2025</span>
                            </div>
                            <span className="text-xs font-mono text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">16:30</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-100 rounded-lg hover:border-stone-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="text-stone-400"><MoreHorizontal size={14} className="rotate-45" /></div>
                                <span className="text-xs font-bold text-stone-700">Lun 05/01/2026</span>
                            </div>
                            <span className="text-xs font-mono text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">10:00</span>
                        </div>
                    </div>

                    {/* Staff Note */}
                    <div className="bg-[#FFF9C4] border border-[#FFF59D] rounded-lg p-4 mb-8 shadow-sm">
                        <div className="text-[9px] font-bold text-[#FBC02D] uppercase tracking-wider mb-2">Staff Note</div>
                        <p className="text-xs text-[#F57F17] leading-relaxed">
                            Addebitata stripe 03.12 nath deve pagare 30€ tax
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-stone-100 mb-6">
                        <button className="flex-1 pb-3 text-stone-900 border-b-2 border-stone-900"><Info size={16} className="mx-auto" /></button>
                        <button className="flex-1 pb-3 text-stone-300 hover:text-stone-500 transition-colors"><Home size={16} className="mx-auto" /></button>
                        <button className="flex-1 pb-3 text-stone-300 hover:text-stone-500 transition-colors"><CreditCard size={16} className="mx-auto" /></button>
                        <button className="flex-1 pb-3 text-stone-300 hover:text-stone-500 transition-colors"><MessageCircle size={16} className="mx-auto" /></button>
                    </div>

                    {/* Data List */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Reservation Data</h4>
                        
                        <div className="flex justify-between items-center text-xs border-b border-stone-50 pb-2">
                            <span className="text-stone-400 uppercase">Prenotazione</span>
                            <span className="text-stone-900 font-medium text-right truncate w-32">Szewczyk Donata [17...</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-stone-50 pb-2">
                            <span className="text-stone-400 uppercase">Unità</span>
                            <span className="text-stone-900 font-medium">206 MUG - MAT PIC</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-stone-50 pb-2">
                            <span className="text-stone-400 uppercase">Codice</span>
                            <span className="text-stone-900 font-medium">17722/2025</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-stone-50 pb-2">
                            <span className="text-stone-400 uppercase">Codice OTA</span>
                            <span className="text-stone-900 font-medium">6865561948 - Booking</span>
                        </div>
                         <div className="flex justify-between items-center text-xs border-b border-stone-50 pb-2">
                            <span className="text-stone-400 uppercase">Adulti</span>
                            <span className="text-stone-900 font-medium">2</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};