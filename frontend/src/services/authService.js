const API = import.meta.env.VITE_API_URL;

export async function loginUser(credentials) {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return await res.json();
}

export async function registerUser(userData) {
  const res = await fetch(`${API}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return await res.json();
}