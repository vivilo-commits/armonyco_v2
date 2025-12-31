import React, { useState, useEffect } from 'react';
import { Settings, Bell, Layers, Database, Smartphone, Key, User, Building, CreditCard, BookOpen, HelpCircle, CheckCircle, ChevronRight, AlertTriangle, Calendar, Plus, RefreshCw, X, ArrowRight, Activity, FileText, Camera, LogOut, Moon, Sun, Monitor, Laptop, Shield, Lock, Clock, UploadCloud, Download, AlertCircle, Copy, Check, XCircle, Save, Link } from '../../components/ui/Icons';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { FloatingInput } from '../../components/ui/FloatingInput';

interface SettingsViewProps {
  activeView?: string;
  userProfile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string | null;
  };
  onUpdateProfile: (data: any) => void;
  organization: {
    name: string;
    billingEmail: string;
    language: string;
    timezone: string;
  };
  onUpdateOrganization: (data: any) => void;
  
  // Lifted state for billing & credits
  billingDetails: {
      legalName: string;
      vatNumber: string;
      fiscalCode: string;
      address: string;
      city: string;
      zip: string;
      country: string;
      sdiCode: string;
      pecEmail: string;
  };
  onUpdateBillingDetails: (data: any) => void;
  currentCredits: number;
  onUpdateCredits: (amount: number) => void;
}

type SettingsTab = 'PROFILE' | 'ORG' | 'ACTIVATION' | 'NOTIFICATIONS' | 'BILLING';

// --- Helper for Cost ---
const COST_PER_CREDIT = 0.0010;

// --- Modal Component ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-in border border-stone-200">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h3 className="font-medium text-stone-900">{title}</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-900"><X size={20} /></button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3 items-center">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export const SettingsView: React.FC<SettingsViewProps> = ({ 
    activeView, 
    userProfile, 
    onUpdateProfile, 
    organization, 
    onUpdateOrganization,
    billingDetails,
    onUpdateBillingDetails,
    currentCredits,
    onUpdateCredits
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
  
  // Effect to sync prop activeView with internal state
  useEffect(() => {
    if (activeView) {
      if (activeView === 'settings-profile') setActiveTab('PROFILE');
      if (activeView === 'settings-org') setActiveTab('ORG');
      if (activeView === 'settings-activation') setActiveTab('ACTIVATION');
      if (activeView === 'settings-notifications') setActiveTab('NOTIFICATIONS');
      if (activeView === 'settings-billing') setActiveTab('BILLING');
    }
  }, [activeView]);

  // -- Profile Local State (Synced with Props) --
  const [localProfile, setLocalProfile] = useState(userProfile);
  useEffect(() => setLocalProfile(userProfile), [userProfile]);

  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  // -- Org Local State (Synced with Props) --
  const [localOrg, setLocalOrg] = useState(organization);
  useEffect(() => setLocalOrg(organization), [organization]);

  // -- Billing Details Local State --
  const [localBillingDetails, setLocalBillingDetails] = useState(billingDetails);
  useEffect(() => setLocalBillingDetails(billingDetails), [billingDetails]);

  // -- Security State --
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // -- Preferences State --
  const [timeFormat, setTimeFormat] = useState('24h');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [theme, setTheme] = useState('system');
  
  // -- Legal State --
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  // -- Org Billing Details State --
  const [showBillingModal, setShowBillingModal] = useState(false);
  
  const isBillingDetailsComplete = localBillingDetails.legalName && localBillingDetails.vatNumber && localBillingDetails.address;

  // -- Activation State --
  const [activationSteps, setActivationSteps] = useState([
      { id: 1, label: 'Connect WhatsApp Business API', status: 'Pending' },
      { id: 2, label: 'Connect PMS', status: 'Pending' },
      { id: 3, label: 'Knowledge Base', status: 'Pending' }
  ]);
  const [activeStepModal, setActiveStepModal] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Activation Forms State
  const [waForm, setWaForm] = useState({
      accessToken: '', businessId: '', phoneId: '', clientId: '', clientSecret: ''
  });
  const [pmsForm, setPmsForm] = useState({
      provider: 'Kross Booking', username: '', password: '', pmsId: ''
  });
  const [kbFiles, setKbFiles] = useState<string[]>([]);

  // -- Notification State --
  const [notifConfig, setNotifConfig] = useState({
    systemIncidents: true,
    integrationFailures: true,
    slaRisk: true,
    complianceAlerts: false,
    budgetWarnings: true,
    emailChannel: true,
    appChannel: true,
  });

  // -- Billing State --
  const [budgetLimit, setBudgetLimit] = useState<string>('500');
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  
  const currentMonthSpend = 521.4020;
  
  const transactions = [
      { date: 'Oct 24, 2023', type: 'Usage', ops: 1420, credits: 1850, amount: 1.8500, balance: 124.5000, ref: 'Daily Agg' },
      { date: 'Oct 23, 2023', type: 'Usage', ops: 1210, credits: 1600, amount: 1.6000, balance: 126.3500, ref: 'Daily Agg' },
      { date: 'Oct 22, 2023', type: 'Top-up', ops: '-', credits: '-', amount: 100.0000, balance: 127.9500, ref: 'INV-9921' },
      { date: 'Oct 21, 2023', type: 'Usage', ops: 1105, credits: 1450, amount: 1.4500, balance: 27.9500, ref: 'Daily Agg' },
  ];

  const handleValidation = (stepId: number) => {
      setValidationError(null);
      setIsValidating(true);

      // Simulate network request
      setTimeout(() => {
          let success = true;
          let errorMsg = '';

          if (stepId === 1) {
              if (!waForm.accessToken || !waForm.businessId || !waForm.clientId || !waForm.clientSecret) {
                  success = false;
                  errorMsg = 'Please fill in all required fields marked with *';
              }
          } else if (stepId === 2) {
              if (!pmsForm.username || !pmsForm.password) {
                  success = false;
                  errorMsg = 'Invalid credentials or unreachable endpoint.';
              }
          } else if (stepId === 3) {
              if (kbFiles.length === 0) {
                  // Optional validation
              }
          }

          setIsValidating(false);

          if (success) {
              setActivationSteps(steps => steps.map(s => s.id === stepId ? { ...s, status: 'Completed' } : s));
              setActiveStepModal(null);
          } else {
              setValidationError(errorMsg);
              setActivationSteps(steps => steps.map(s => s.id === stepId ? { ...s, status: 'Error' } : s));
          }
      }, 2000);
  };

  const handleSaveBillingDetails = () => {
      onUpdateBillingDetails(localBillingDetails);
      setShowBillingModal(false);
  };

  const renderProfile = () => {
    const initials = `${localProfile.firstName[0] || ''}${localProfile.lastName[0] || ''}`.toUpperCase();

    return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
         {/* Identity Section */}
         <div className="ui-card p-8">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-light text-stone-900">Identity</h2>
                    <p className="text-stone-500 text-sm mt-1">Personal details and contact verification.</p>
                </div>
                <span className="px-2 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider rounded border border-stone-200">
                    ID: USR-9921
                </span>
             </div>

             <div className="flex flex-col md:flex-row gap-8">
                 {/* Avatar */}
                 <div className="flex flex-col items-center gap-3">
                     <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-2xl font-bold border border-stone-200 relative overflow-hidden group shadow-inner">
                         {initials}
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                             <Camera className="text-white" size={24} />
                         </div>
                     </div>
                     <button className="text-xs text-stone-500 hover:text-stone-900 underline">Remove photo</button>
                 </div>

                 {/* Fields */}
                 <div className="flex-1 space-y-6 pt-2">
                     <div className="grid grid-cols-2 gap-4">
                        <FloatingInput 
                            label="First Name" 
                            value={localProfile.firstName} 
                            onChange={(e) => setLocalProfile({...localProfile, firstName: e.target.value})} 
                        />
                        <FloatingInput 
                            label="Last Name" 
                            value={localProfile.lastName} 
                            onChange={(e) => setLocalProfile({...localProfile, lastName: e.target.value})} 
                        />
                     </div>

                     <div>
                        <div className="flex gap-2 items-center">
                            <FloatingInput 
                                label="Email Address" 
                                type="email"
                                value={localProfile.email} 
                                onChange={(e) => setLocalProfile({...localProfile, email: e.target.value})} 
                            />
                            {emailVerified ? (
                                <div className="h-12 flex items-center gap-1 px-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-xs font-medium">
                                    <CheckCircle size={14} /> Verified
                                </div>
                            ) : (
                                <button className="h-12 px-3 bg-stone-100 border border-stone-200 rounded-lg text-stone-600 text-xs font-medium hover:bg-stone-200 ui-btn-secondary">
                                    Verify
                                </button>
                            )}
                        </div>
                     </div>

                     <div>
                        <div className="flex gap-2 items-center">
                            <FloatingInput 
                                label="Phone Number" 
                                value={localProfile.phone} 
                                onChange={(e) => setLocalProfile({...localProfile, phone: e.target.value})} 
                            />
                            {phoneVerified ? (
                                <div className="h-12 flex items-center gap-1 px-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-xs font-medium">
                                    <CheckCircle size={14} /> Verified
                                </div>
                            ) : (
                                <button className="h-12 px-3 bg-stone-100 border border-stone-200 rounded-lg text-stone-600 text-xs font-medium hover:bg-stone-200 whitespace-nowrap ui-btn-secondary">
                                    Send Code
                                </button>
                            )}
                        </div>
                     </div>
                 </div>
             </div>
         </div>

         {/* Security Section */}
         <div className="ui-card p-8">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-light text-stone-900">Security</h2>
                    <p className="text-stone-500 text-sm mt-1">Password, 2FA, and active sessions.</p>
                </div>
             </div>

             <div className="divide-y divide-stone-100">
                 {/* Password */}
                 <div className="py-4 flex justify-between items-center">
                     <div>
                         <div className="text-sm font-medium text-stone-900">Password</div>
                         <div className="text-xs text-stone-500">Last changed 3 months ago</div>
                     </div>
                     <button onClick={() => setShowPasswordModal(true)} className="ui-btn-secondary px-3 py-1.5 text-xs">
                         Change Password
                     </button>
                 </div>

                 {/* 2FA */}
                 <div className="py-4 flex justify-between items-center">
                     <div>
                         <div className="text-sm font-medium text-stone-900">Two-Factor Authentication</div>
                         <div className="text-xs text-stone-500">Secure your account with an authenticator app.</div>
                     </div>
                     <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} className={`w-10 h-5 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${twoFactorEnabled ? 'left-6' : 'left-1'}`} />
                     </button>
                 </div>
             </div>
         </div>

         {/* Save Action */}
         <div className="flex justify-end pt-4 pb-12">
             <AnimatedButton 
                text="Save Changes"
                icon={<Save size={18} />}
                onClick={() => onUpdateProfile(localProfile)}
                width="140px"
             />
         </div>

         {/* Password Modal */}
         <Modal 
            isOpen={showPasswordModal} 
            onClose={() => setShowPasswordModal(false)} 
            title="Change Password"
            footer={
                <>
                    <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 mr-2">Cancel</button>
                    <AnimatedButton 
                        text="Update"
                        icon={<CheckCircle size={18} />}
                        onClick={() => setShowPasswordModal(false)}
                        width="110px"
                    />
                </>
            }
         >
             <div className="space-y-5 pt-2">
                 <FloatingInput 
                    label="Current Password" 
                    type="password"
                 />
                 <FloatingInput 
                    label="New Password" 
                    type="password"
                 />
                 <FloatingInput 
                    label="Confirm New Password" 
                    type="password"
                 />
             </div>
         </Modal>
    </div>
  )};

  const renderOrg = () => (
    <div className="ui-card p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div className="border-b border-stone-100 pb-6 mb-6">
            <h2 className="text-xl font-light text-stone-900">Organization Settings</h2>
            <p className="text-stone-500 text-sm mt-1">Manage company identity and global preferences.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
                <FloatingInput 
                    label="Organization Name" 
                    value={localOrg.name} 
                    readOnly 
                    className="bg-stone-50 text-stone-500 cursor-not-allowed"
                    bgClass="bg-stone-50"
                />
            </div>
            <div>
                <FloatingInput 
                    label="Billing Email" 
                    type="email"
                    value={localOrg.billingEmail} 
                    onChange={e => setLocalOrg({...localOrg, billingEmail: e.target.value})} 
                />
            </div>
        </div>

        {/* Billing Details Card */}
        <div className="mt-8 border-t border-stone-100 pt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-stone-900">Billing Details</h3>
                {isBillingDetailsComplete ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        <CheckCircle size={12} /> Completed
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-xs text-stone-400 font-bold uppercase tracking-wider bg-stone-100 px-2 py-1 rounded border border-stone-200">
                        Incomplete
                    </span>
                )}
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex justify-between items-center">
                <div className="text-sm text-stone-600">
                    <div className="font-medium text-stone-900">{localBillingDetails.legalName || 'Legal Entity Name'}</div>
                    <div className="text-xs text-stone-500 mt-1">{localBillingDetails.vatNumber ? `VAT: ${localBillingDetails.vatNumber}` : 'VAT ID not set'}</div>
                </div>
                <button onClick={() => setShowBillingModal(true)} className="ui-btn-secondary px-4 py-2 text-xs">
                    Edit Details
                </button>
            </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex justify-end">
             <AnimatedButton 
                text="Save Changes"
                icon={<Save size={18} />}
                onClick={() => onUpdateOrganization(localOrg)}
                width="140px"
             />
         </div>

         {/* Billing Details Modal */}
         <Modal 
            isOpen={showBillingModal} 
            onClose={() => setShowBillingModal(false)} 
            title="Edit Billing Details"
            footer={
                <>
                    <button onClick={() => setShowBillingModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 mr-2">Cancel</button>
                    <AnimatedButton 
                        text="Save"
                        icon={<Save size={18} />}
                        onClick={handleSaveBillingDetails}
                        width="100px"
                    />
                </>
            }
         >
             <div className="space-y-5 pt-2">
                 <FloatingInput 
                    label="Legal Entity Name" 
                    value={localBillingDetails.legalName} 
                    onChange={e => setLocalBillingDetails({...localBillingDetails, legalName: e.target.value})} 
                    placeholder="e.g. Acme Corp S.r.l." 
                 />
                 <div className="grid grid-cols-2 gap-4">
                     <FloatingInput 
                        label="VAT Number" 
                        value={localBillingDetails.vatNumber} 
                        onChange={e => setLocalBillingDetails({...localBillingDetails, vatNumber: e.target.value})} 
                     />
                     <FloatingInput 
                        label="Fiscal Code" 
                        value={localBillingDetails.fiscalCode} 
                        onChange={e => setLocalBillingDetails({...localBillingDetails, fiscalCode: e.target.value})} 
                     />
                 </div>
                 <FloatingInput 
                    label="Address" 
                    value={localBillingDetails.address} 
                    onChange={e => setLocalBillingDetails({...localBillingDetails, address: e.target.value})} 
                 />
                 <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-1">
                         <FloatingInput 
                            label="City" 
                            value={localBillingDetails.city} 
                            onChange={e => setLocalBillingDetails({...localBillingDetails, city: e.target.value})} 
                         />
                     </div>
                     <div className="col-span-1">
                         <FloatingInput 
                            label="ZIP" 
                            value={localBillingDetails.zip} 
                            onChange={e => setLocalBillingDetails({...localBillingDetails, zip: e.target.value})} 
                         />
                     </div>
                     <div className="col-span-1">
                         <FloatingInput 
                            label="Country" 
                            value={localBillingDetails.country} 
                            onChange={e => setLocalBillingDetails({...localBillingDetails, country: e.target.value})} 
                         />
                     </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <FloatingInput 
                        label="SDI Code" 
                        value={localBillingDetails.sdiCode} 
                        onChange={e => setLocalBillingDetails({...localBillingDetails, sdiCode: e.target.value})} 
                     />
                     <FloatingInput 
                        label="PEC Email" 
                        type="email"
                        value={localBillingDetails.pecEmail} 
                        onChange={e => setLocalBillingDetails({...localBillingDetails, pecEmail: e.target.value})} 
                     />
                 </div>
             </div>
         </Modal>
    </div>
  );

  const renderActivation = () => (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="border-b border-stone-100 pb-6 mb-6">
        <h2 className="text-xl font-light text-stone-900">System Activation</h2>
        <p className="text-stone-500 text-sm mt-1">Connect your infrastructure to enable Armonyco.</p>
      </div>

      <div className="space-y-4">
        {activationSteps.map((step) => (
          <div key={step.id} className="ui-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                step.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                step.status === 'Error' ? 'bg-red-50 text-red-600 border-red-100' :
                'bg-stone-50 text-stone-400 border-stone-200'
              }`}>
                {step.status === 'Completed' ? <CheckCircle size={16} /> : step.id}
              </div>
              <div>
                <h3 className="font-medium text-stone-900">{step.label}</h3>
                <p className="text-xs text-stone-400">
                  {step.status === 'Completed' ? 'Connected & Verified' : 'Configuration Required'}
                </p>
              </div>
            </div>
            <AnimatedButton 
                text={step.status === 'Completed' ? 'Configure' : 'Connect'}
                icon={step.status === 'Completed' ? <Settings size={18}/> : <Link size={18}/>}
                onClick={() => setActiveStepModal(step.id)}
                width="120px"
                variant={step.status === 'Completed' ? 'light' : 'dark'}
            />
          </div>
        ))}
      </div>
      
      {/* Example Modal for Step 1 */}
      <Modal
        isOpen={activeStepModal === 1}
        onClose={() => setActiveStepModal(null)}
        title="Connect WhatsApp Business API"
        footer={
           <>
              <button onClick={() => setActiveStepModal(null)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 mr-2">Cancel</button>
              <AnimatedButton 
                  text={isValidating ? "Verifying..." : "Connect"}
                  icon={isValidating ? <RefreshCw size={18} className="animate-spin"/> : <Link size={18}/>}
                  onClick={() => handleValidation(1)}
                  width="125px"
                  disabled={isValidating}
              />
           </>
        }
      >
          <div className="space-y-5 pt-2">
              <p className="text-sm text-stone-500 mb-2">Provide your Meta Developer credentials to enable Amelia.</p>
              <FloatingInput 
                  label="Access Token" 
                  type="password"
                  value={waForm.accessToken} 
                  onChange={e => setWaForm({...waForm, accessToken: e.target.value})} 
                  className="font-mono"
              />
              <FloatingInput 
                  label="Business Account ID" 
                  value={waForm.businessId} 
                  onChange={e => setWaForm({...waForm, businessId: e.target.value})} 
                  className="font-mono"
              />
          </div>
      </Modal>
    </div>
  );

  const renderNotifications = () => (
      <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="border-b border-stone-100 pb-6 mb-6">
            <h2 className="text-xl font-light text-stone-900">Notification Preferences</h2>
            <p className="text-stone-500 text-sm mt-1">Control when and how you are alerted.</p>
          </div>

          <div className="ui-card p-0 overflow-hidden mb-8">
              <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">System Alerts</h3>
              </div>
              <div className="divide-y divide-stone-100">
                  {[
                      { id: 'systemIncidents', label: 'System Incidents', desc: 'Critical failures in core constructs (AEM/AOS).' },
                      { id: 'integrationFailures', label: 'Integration Failures', desc: 'Connectivity loss with PMS or WhatsApp.' },
                      { id: 'budgetWarnings', label: 'Budget Warnings', desc: 'When credit usage exceeds 80% of limit.' },
                  ].map(item => (
                      <div key={item.id} className="p-6 flex items-center justify-between hover:bg-stone-50/50 transition-colors">
                          <div>
                              <div className="font-medium text-stone-900 text-sm">{item.label}</div>
                              <div className="text-xs text-stone-500 mt-0.5">{item.desc}</div>
                          </div>
                          <button 
                              onClick={() => setNotifConfig({...notifConfig, [item.id]: !notifConfig[item.id as keyof typeof notifConfig]})}
                              className={`w-10 h-5 rounded-full transition-colors relative ${notifConfig[item.id as keyof typeof notifConfig] ? 'bg-stone-900' : 'bg-stone-200'}`}
                          >
                              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${notifConfig[item.id as keyof typeof notifConfig] ? 'left-6' : 'left-1'}`} />
                          </button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="ui-card p-0 overflow-hidden">
              <div className="bg-stone-50 px-6 py-3 border-b border-stone-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Channels</h3>
              </div>
              <div className="divide-y divide-stone-100">
                  <div className="p-6 flex items-center justify-between">
                      <div>
                          <div className="font-medium text-stone-900 text-sm">Email Notifications</div>
                          <div className="text-xs text-stone-500 mt-0.5">Send alerts to {userProfile.email}</div>
                      </div>
                      <button 
                          onClick={() => setNotifConfig({...notifConfig, emailChannel: !notifConfig.emailChannel})}
                          className={`w-10 h-5 rounded-full transition-colors relative ${notifConfig.emailChannel ? 'bg-stone-900' : 'bg-stone-200'}`}
                      >
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${notifConfig.emailChannel ? 'left-6' : 'left-1'}`} />
                      </button>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                      <div>
                          <div className="font-medium text-stone-900 text-sm">In-App Notifications</div>
                          <div className="text-xs text-stone-500 mt-0.5">Show badge and dropdown in dashboard</div>
                      </div>
                      <button 
                          onClick={() => setNotifConfig({...notifConfig, appChannel: !notifConfig.appChannel})}
                          className={`w-10 h-5 rounded-full transition-colors relative ${notifConfig.appChannel ? 'bg-stone-900' : 'bg-stone-200'}`}
                      >
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${notifConfig.appChannel ? 'bg-stone-900' : 'bg-stone-200'}`}
                      >
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${notifConfig.appChannel ? 'left-6' : 'left-1'}`} />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderBilling = () => (
      <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="border-b border-stone-100 pb-6 mb-6">
            <h2 className="text-xl font-light text-stone-900">Pricing & Billing</h2>
            <p className="text-stone-500 text-sm mt-1">Manage credits and payment methods.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Credit Balance */}
              <div className="ui-card-dark p-8 relative overflow-hidden">
                  <div className="relative z-10">
                      <div className="text-stone-400 text-xs uppercase tracking-widest font-bold mb-4">Current Balance</div>
                      <div className="text-5xl font-mono text-white mb-2">{currentCredits.toFixed(4)}</div>
                      <div className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                          <CheckCircle size={14} /> Active
                      </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                      <CreditCard size={120} />
                  </div>
              </div>

              {/* Top Up / Plan */}
              <div className="ui-card p-8 flex flex-col justify-between">
                  <div>
                      <div className="flex justify-between items-start mb-4">
                          <h3 className="text-stone-900 font-medium">Commercial Plan</h3>
                          <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Standard</span>
                      </div>
                      <div className="text-3xl font-mono text-stone-900 mb-1">€0.0010 <span className="text-sm text-stone-500 font-sans">/ credit</span></div>
                      <p className="text-xs text-stone-500">Pay as you go. No fixed fees.</p>
                  </div>
                  <div className="mt-6">
                      <AnimatedButton 
                          text="Top Up Credits"
                          icon={<Plus size={18} />}
                          width="170px"
                          onClick={() => onUpdateCredits(currentCredits + 100)} // Mock top up
                      />
                  </div>
              </div>
          </div>

          {/* Budget Control */}
          <div className="ui-card p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-stone-100 rounded-lg text-stone-600">
                      <AlertTriangle size={20} />
                  </div>
                  <div>
                      <h3 className="text-stone-900 font-medium text-sm">Monthly Budget Limit</h3>
                      <p className="text-stone-500 text-xs mt-0.5">Stop automation when spend exceeds limit</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="relative">
                      <span className="absolute left-3 top-2 text-stone-400 text-xs">€</span>
                      <input 
                          type="number" 
                          value={budgetLimit} 
                          onChange={(e) => setBudgetLimit(e.target.value)}
                          className="w-24 py-1.5 pl-6 pr-2 bg-stone-50 border border-stone-200 rounded text-sm text-stone-900 focus:outline-none focus:border-stone-400 text-right"
                          disabled={!budgetEnabled}
                      />
                  </div>
                  <button 
                      onClick={() => setBudgetEnabled(!budgetEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${budgetEnabled ? 'bg-stone-900' : 'bg-stone-200'}`}
                  >
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${budgetEnabled ? 'left-6' : 'left-1'}`} />
                  </button>
              </div>
          </div>

          {/* Transaction History */}
          <div className="ui-card p-0 overflow-hidden">
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-100">
                  <h3 className="text-sm font-medium text-stone-900 uppercase tracking-wider">Transaction History</h3>
              </div>
              <table className="w-full text-left text-sm">
                  <thead className="bg-white text-stone-500 font-medium border-b border-stone-100 text-xs uppercase tracking-wider">
                      <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Reference</th>
                          <th className="px-6 py-4 text-right">Amount (€)</th>
                          <th className="px-6 py-4 text-right">Balance</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs font-mono">
                      {transactions.map((tx, i) => (
                          <tr key={i} className="hover:bg-stone-50 transition-colors">
                              <td className="px-6 py-4 text-stone-500">{tx.date}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                      tx.type === 'Top-up' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-stone-100 text-stone-600 border border-stone-200'
                                  }`}>
                                      {tx.type}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-stone-900">{tx.ref}</td>
                              <td className="px-6 py-4 text-right text-stone-900 font-bold">
                                  {tx.type === 'Top-up' ? '+' : '-'}{Number(tx.amount).toFixed(4)}
                              </td>
                              <td className="px-6 py-4 text-right text-stone-500">{Number(tx.balance).toFixed(4)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {activeTab === 'PROFILE' && renderProfile()}
      {activeTab === 'ORG' && renderOrg()}
      {activeTab === 'ACTIVATION' && renderActivation()}
      {activeTab === 'NOTIFICATIONS' && renderNotifications()}
      {activeTab === 'BILLING' && renderBilling()}
    </div>
  );
};