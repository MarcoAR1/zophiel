const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('zophiel_token');
}

export function setToken(token: string) {
  localStorage.setItem('zophiel_token', token);
}

export function setRefreshToken(token: string) {
  localStorage.setItem('zophiel_refresh', token);
}

export function clearTokens() {
  localStorage.removeItem('zophiel_token');
  localStorage.removeItem('zophiel_refresh');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Error ${res.status}`);
  }

  return json.data;
}

// ── Auth ──
export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<any>('/auth/me'),
  },

  pain: {
    create: (data: any) =>
      request<any>('/pain', { method: 'POST', body: JSON.stringify(data) }),
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/pain${qs}`);
    },
    stats: (days = 30) => request<any>(`/pain/stats?days=${days}`),
  },

  symptoms: {
    create: (data: any) =>
      request<any>('/symptoms', { method: 'POST', body: JSON.stringify(data) }),
    list: (days = 30) => request<any[]>(`/symptoms?days=${days}`),
    stats: (days = 30) => request<any>(`/symptoms/stats?days=${days}`),
  },

  questions: {
    pending: () => request<any[]>('/questions/pending'),
    respond: (id: string, value: number) =>
      request<any>(`/questions/${id}/respond`, {
        method: 'POST',
        body: JSON.stringify({ value }),
      }),
    history: (days = 30) => request<any[]>(`/questions/history?days=${days}`),
  },

  analytics: {
    painTrend: (period = 30) => request<any[]>(`/analytics/pain-trend?period=${period}`),
    qualityOfLife: (period = 30) => request<any[]>(`/analytics/quality-of-life?period=${period}`),
    symptomCorrelation: (period = 30) =>
      request<any[]>(`/analytics/symptom-correlation?period=${period}`),
  },

  settings: {
    updateNotifications: (data: any) =>
      request<any>('/settings/notifications', { method: 'PUT', body: JSON.stringify(data) }),
    updateProfile: (data: any) =>
      request<any>('/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },

  onboarding: {
    complete: (data: any) =>
      request<any>('/onboarding/complete', { method: 'POST', body: JSON.stringify(data) }),
  },
};
