const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(API_URL + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})},
    
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error');
  }

  return data;
}
