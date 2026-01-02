import { ProductModule } from '../src/types';

export const productModules: ProductModule[] = [
  // --- CORE COVERAGE: GUEST ---
  {
    id: 'cc-01',
    code: 'CC-01',
    name: 'Pre-arrival Info',
    category: 'GUEST',
    description: 'Automated guest verification and essential info delivery.',
    what: 'Orchestrates the pre-arrival sequence 48h before check-in.',
    why: ['Reduces "where is the address" queries by 90%', 'Ensures legal compliance before entry', 'Sets professional tone'],
    how: 'Lara validates booking data → Amelia sends structured WhatsApp with location & house rules.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'cc-02',
    code: 'CC-02',
    name: 'Check-in Instructions + Access',
    category: 'GUEST',
    description: 'Secure delivery of access codes upon ID verification.',
    what: 'Releases property access information only after pre-arrival conditions are met.',
    why: ['Zero unsecured access events', 'Prevents lockouts via proactive delivery', 'Audit trail of who entered and when'],
    how: 'James verifies ID status → Amelia delivers smart lock code/keybox details via WhatsApp.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'cc-03',
    code: 'CC-03',
    name: 'Wi-Fi & House Manual (Top FAQ)',
    category: 'GUEST',
    description: 'Proactive delivery of critical property assets.',
    what: 'Instantly provides Wi-Fi and manual details upon arrival detection.',
    why: ['Eliminates the #1 guest question', 'Improves first-hour guest sentiment', 'Reduces support ticket volume'],
    how: 'Amelia detects arrival intent/question → Amelia serves asset card immediately.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'cc-04',
    code: 'CC-04',
    name: 'Checkout Instructions + Deposits',
    category: 'GUEST',
    description: 'Governance of the departure process and tax collection.',
    what: 'Manages the exit flow, city tax collection, and checkout confirmation.',
    why: ['Increases on-time checkout compliance', 'Automates city tax calculation & proof', 'Streamlines cleaning scheduling'],
    how: 'Elon triggers schedule → Amelia sends checkout guide & payment link.',
    isActive: false,
    requiresExternal: true
  },
  {
    id: 'cc-05',
    code: 'CC-05',
    name: 'Issue Triage',
    category: 'GUEST',
    description: 'First-line defense for guest complaints.',
    what: 'Categorizes incoming guest issues and determines severity.',
    why: ['Filters 60% of noise from reaching humans', 'Standardizes problem reporting', 'Creates evidence record for disputes'],
    how: 'Amelia ingests message → Lara classifies severity → Escalates or Resolves.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'cc-06',
    code: 'CC-06',
    name: 'Multi-language + Brand Tone',
    category: 'GUEST',
    description: 'Linguistic enforcement across all communications.',
    what: 'Translates and tone-checks all outbound communications.',
    why: ['Native language experience for 100% of guests', 'Prevents brand tone drift', 'Reduces misunderstanding risk'],
    how: 'Amelia processing engine detects language → Adapts response dynamically.',
    isActive: true,
    requiresExternal: true
  },

  // --- CORE COVERAGE: REVENUE ---
  {
    id: 'cc-07',
    code: 'CC-07',
    name: 'Orphan Days / Stay Extension',
    category: 'REVENUE',
    description: 'Gap-filling automation for calendar efficiency.',
    what: 'Identifies unbookable gap days and offers them to current guests.',
    why: ['Monetizes 0-value inventory', 'Increases RevPAR without acquisition cost', 'High conversion convenience offer'],
    how: 'James scans calendar gaps → Amelia offers extension to current guest.',
    isActive: false,
    requiresExternal: true
  },
  {
    id: 'cc-08',
    code: 'CC-08',
    name: 'Late Check-in / Late Check-out',
    category: 'REVENUE',
    description: 'Monetization of arrival and departure flexibility.',
    what: 'Validates operational capacity and sells time flexibility.',
    why: ['Standardizes "can I stay longer" requests', 'Generates pure margin revenue', 'Prevents cleaning clashes'],
    how: 'James checks cleaning schedule → Amelia presents priced option to guest.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'cc-09',
    code: 'CC-09',
    name: 'Transfer / Experience Upsell',
    category: 'REVENUE',
    description: 'Ancillary revenue orchestration.',
    what: 'Offers curated transport and local experiences at high-intent moments.',
    why: ['Increases basket size', 'improves guest logistics experience', 'Automates vendor coordination'],
    how: 'Lara selects relevant offer → Amelia presents card → Elon notifies vendor.',
    isActive: false,
    requiresExternal: true
  },

  // --- CORE COVERAGE: OPS ---
  {
    id: 'cc-10',
    code: 'CC-10',
    name: 'Maintenance Triage',
    category: 'OPS',
    description: 'Technical issue diagnosis and dispatch.',
    what: 'Diagnoses reported maintenance issues before dispatching teams.',
    why: ['Prevents "fake" call-outs (e.g. user error)', 'Enriches ticket with photos/video', 'Prioritizes urgent vs cosmetic'],
    how: 'Amelia collects evidence → Elon creates ticket → Dispatches to Maintenance.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'cc-11',
    code: 'CC-11',
    name: 'Housekeeping Exceptions',
    category: 'OPS',
    description: 'Dynamic cleaning schedule adjustments.',
    what: 'Adjusts cleaning workflows based on real-time guest movement.',
    why: ['Prevents cleaners entering occupied rooms', 'Optimizes route based on checkout time', 'Reduces waiting time'],
    how: 'Amelia confirms checkout → Elon updates cleaning dashboard instantly.',
    isActive: true,
    requiresExternal: false
  },
  {
    id: 'cc-12',
    code: 'CC-12',
    name: 'Human Escalation Pack',
    category: 'OPS',
    description: 'Structured handover to human agents.',
    what: 'Governs the protocol for when AI cannot resolve an issue.',
    why: ['Ensures humans only handle novel problems', 'Provides full context summary', 'Tracks "Why AI Failed" for training'],
    how: 'Lara declares "Unknown Intent" → Summarizes context → Pings Human Support.',
    isActive: true,
    requiresExternal: false
  },

  // --- INCIDENT PLAYBOOKS ---
  {
    id: 'pb-01',
    code: 'PB-01',
    name: 'Guest can\'t enter',
    category: 'PLAYBOOK',
    description: 'Emergency access protocol.',
    what: 'High-priority troubleshooting for smart locks and keyboxes.',
    why: ['Critical failure prevention', 'Prevents refund claims', 'Immediate alternate entry method'],
    how: 'Amelia identifies urgency → James checks lock status → Provides backup code.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-02',
    code: 'PB-02',
    name: 'Wi-Fi not working',
    category: 'PLAYBOOK',
    description: 'Connectivity troubleshooting sequence.',
    what: 'Steps guest through router reset and alternative network checks.',
    why: ['Resolves 80% of router lock-ups', 'Avoids sending technician for simple reset', 'Maintains "Work from Home" amenity promise'],
    how: 'Amelia guides troubleshooting → Elon pings ISP API (if available).',
    isActive: false,
    requiresExternal: true
  },
  {
    id: 'pb-03',
    code: 'PB-03',
    name: 'Noise / Complaint',
    category: 'PLAYBOOK',
    description: 'Neighbor and guest conflict resolution.',
    what: 'Manages incoming noise alerts or neighbor complaints.',
    why: ['Protects license/permit', 'De-escalates before police involvement', 'Evidence for eviction if needed'],
    how: 'Amelia warns guest (if noise sensor triggered) OR receives neighbor text → Logs incident.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-04',
    code: 'PB-04',
    name: 'AC/Heating not working',
    category: 'PLAYBOOK',
    description: 'Climate control troubleshooting.',
    what: 'Remote diagnosis of HVAC systems.',
    why: ['Immediate comfort restoration', 'Prevents hardware damage from misuse', 'Verifies settings before dispatch'],
    how: 'Amelia requests remote photo → Elon checks IoT thermostat status → Adjusts.',
    isActive: false,
    requiresExternal: true
  },
  {
    id: 'pb-05',
    code: 'PB-05',
    name: 'No hot water',
    category: 'PLAYBOOK',
    description: 'Boiler and heater triage.',
    what: 'Safety checks and boiler reset instructions.',
    why: ['High-severity ticket resolution', 'Safety compliance check', 'Rapid alternative provision'],
    how: 'Amelia guides boiler check → Escalate to Emergency Ops if unresolved.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-06',
    code: 'PB-06',
    name: 'Cleaning not satisfactory',
    category: 'PLAYBOOK',
    description: 'Cleanliness dispute management.',
    what: 'Handles reports of missing towels or cleaning issues.',
    why: ['Captures photo evidence immediately', 'Validates claim against checkout photos', 'Arranges spot-clean or refund'],
    how: 'Amelia requests photos → Lara compares to pre-stay evidence → Offers remedy.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-07',
    code: 'PB-07',
    name: 'Early check-in request',
    category: 'PLAYBOOK',
    description: 'Arrival schedule modification.',
    what: 'Processes requests for access before standard time.',
    why: ['Manages guest expectations', 'Monetizes if available', 'Protects cleaning window'],
    how: 'James checks unit status → Amelia confirms or denies based on policy.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-08',
    code: 'PB-08',
    name: 'Late checkout request',
    category: 'PLAYBOOK',
    description: 'Departure schedule modification.',
    what: 'Processes requests for access after standard time.',
    why: ['Prevents cleaner idle time', 'Monetizes extension', 'Enforces hard exit times'],
    how: 'James checks next arrival → Amelia offers paid slot or luggage storage.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-09',
    code: 'PB-09',
    name: 'Missing payment / city tax',
    category: 'PLAYBOOK',
    description: 'Financial compliance enforcement.',
    what: 'Chases outstanding balances during stay.',
    why: ['Ensures 100% collection', 'Blocks access if critical debt', 'Automates uncomfortable conversations'],
    how: 'Elon flags balance → Amelia restricts access info until settled.',
    isActive: true,
    requiresExternal: true
  },
  {
    id: 'pb-10',
    code: 'PB-10',
    name: 'Missing ID / document',
    category: 'PLAYBOOK',
    description: 'Regulatory compliance enforcement.',
    what: 'Chases missing identity documents required by law.',
    why: ['Legal compliance protection', 'Police reporting automation', 'Security vetting'],
    how: 'Elon flags missing doc → Amelia requests secure upload.',
    isActive: true,
    requiresExternal: true
  }
];