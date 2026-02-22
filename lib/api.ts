const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

export const api = {
  auth: {
    register: async (data: { username: string; email: string; password: string; role: string }) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    login: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      return res.json();
    },
  },

  workers: {
    list: async (verified = true) => {
      const res = await fetch(`${API_URL}/workers?verified=${verified}`);
      return res.json();
    },
    getProfile: async () => {
      const res = await fetch(`${API_URL}/workers/profile`, {
        headers: { ...getAuthHeader() },
      });
      return res.json();
    },
    updateProfile: async (data: { serviceCategory: string; experienceYears: number; description: string; location: { lat: number | null; lng: number | null; address: string } }) => {
      const res = await fetch(`${API_URL}/workers/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },

  bookings: {
    create: async (data: { workerId: string; service: string; bookingDate: string }) => {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    getCustomer: async () => {
      const res = await fetch(`${API_URL}/bookings/customer`, {
        headers: { ...getAuthHeader() },
      });
      return res.json();
    },
    getWorker: async () => {
      const res = await fetch(`${API_URL}/bookings/worker`, {
        headers: { ...getAuthHeader() },
      });
      return res.json();
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
  },
};
