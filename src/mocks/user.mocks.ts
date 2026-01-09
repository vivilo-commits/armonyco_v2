import { UserProfile, UserRole, Organization, BillingDetails } from '../models/user.model';

export const mockUserProfile: UserProfile = {
    id: 'usr-001',
    firstName: 'Executive',
    lastName: 'Admin',
    email: 'admin@armonyco.com',
    phone: '+1 (555) 0123-4567',
    photo: null,
    role: UserRole.EXECUTIVE,
    jobRole: 'Regional Operations Director',
    credits: 25000,
};

export const mockOrganization: Organization = {
    id: 'org-001',
    name: 'Acme Hospitality Group',
    billingEmail: 'billing@acme.com',
    language: 'EN',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

export const mockBillingDetails: BillingDetails = {
    legalName: '',
    vatNumber: '',
    fiscalCode: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    sdiCode: '',
    pecEmail: ''
};
