import { UserRole, UserSession } from './types';

export const DEMO_USERS: Record<UserRole, UserSession> = {
  PATIENT: {
    id: 'user-patient-001',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '9876543210',
    role: 'PATIENT',
  },
  ADMIN: {
    id: 'user-admin-001',
    name: 'QuickLabz Admin',
    email: 'admin@quicklabz.com',
    phone: '7018623940',
    role: 'ADMIN',
  },
  LAB_PARTNER: {
    id: 'user-lab-001',
    name: 'Apex Diagnostic Care Manager',
    email: 'lab@apexdiagnostics.com',
    phone: '9811122233',
    role: 'LAB_PARTNER',
    labId: 'apex-diagnostic-care',
  },
  COLLECTOR: {
    id: 'user-collector-001',
    name: 'Rajesh Kumar (Phlebotomist)',
    email: 'collector@quicklabz.com',
    phone: '9811022334',
    role: 'COLLECTOR',
    collectorId: 'collector-rajesh-001',
  },
};

const SESSION_COOKIE_KEY = 'quicklabz_session_role';

export function getClientSessionRole(): UserRole {
  if (typeof window === 'undefined') return 'PATIENT';
  const match = document.cookie.match(new RegExp('(^| )' + SESSION_COOKIE_KEY + '=([^;]+)'));
  if (match && (['PATIENT', 'ADMIN', 'LAB_PARTNER', 'COLLECTOR'] as UserRole[]).includes(match[2] as UserRole)) {
    return match[2] as UserRole;
  }
  return 'PATIENT';
}

export function setClientSessionRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SESSION_COOKIE_KEY}=${role}; path=/; max-age=86400; SameSite=Lax`;
  window.dispatchEvent(new Event('quicklabz-auth-change'));
}
