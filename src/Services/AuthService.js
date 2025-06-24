import axios from "axios";
import { jwtDecode } from "jwt-decode";


export const client = axios.create({
  baseURL: 'http://localhost:5067',
  headers: {
    'Content-Type': 'application/json'
  },
});


client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login({ email, password }) {
  const { data } = await client.post('/login', {
    email,
    password
  });
  return data.token;
}


export function decodeToken(token) {
  return jwtDecode(token);
}
