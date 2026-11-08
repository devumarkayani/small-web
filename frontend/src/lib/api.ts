const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export type Site = { _id: string; address: string; title: string; html: string; author: string; textContent?: string };
export type Person = { _id: string; name: string; kind: string };
export type Visit = { _id: string; personId: string; personName: string; address: string; title: string; method: string; visitedAt: string };
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.');
  return data as T;
}
export const api = {
  people: () => request<Person[]>('/people'),
  site: (address: string) => request<Site>(`/sites/${encodeURIComponent(address.toLowerCase())}`),
  sites: () => request<Pick<Site,'address'|'title'|'author'>[]>('/sites'),
  search: (q: string) => request<Site[]>(`/search?q=${encodeURIComponent(q)}`),
  history: (id: string) => request<Visit[]>(`/history/${encodeURIComponent(id)}`),
  visit: (body: Omit<Visit,'_id'|'visitedAt'>) => request<Visit>('/history', { method: 'POST', body: JSON.stringify(body) }),
  publish: (body: {address:string;title:string;html:string;author:string}) => request<Site>('/sites', { method: 'POST', body: JSON.stringify(body) }),
};
