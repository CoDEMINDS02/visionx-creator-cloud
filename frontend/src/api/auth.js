import { http, setToken } from './http';
import { ENDPOINTS } from './config';

export async function registerUser({ name, email, password }) {
  // Backend field is `full_name`, not `name`.
  return http.post(ENDPOINTS.register, { email, password, full_name: name || undefined });
}

export async function loginUser({ email, password }) {
  // OAuth2PasswordRequestForm expects the email in a field called `username`.
  const token = await http.postForm(ENDPOINTS.login, { username: email, password });
  setToken(token.access_token);
  return token;
}

export async function fetchCurrentUser() {
  return http.get(ENDPOINTS.me);
}

export function logoutUser() {
  setToken(null);
}

export const authApi = { registerUser, loginUser, fetchCurrentUser, logoutUser };
export default authApi;
