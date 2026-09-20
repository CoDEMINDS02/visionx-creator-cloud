import { createContext, useState, useCallback, useEffect } from 'react';
import { registerUser, loginUser, fetchCurrentUser, logoutUser } from '../api/auth';
import { getToken } from '../api/http';

export const AuthContext = createContext(null);

// The backend's UserOut only has { id, email, full_name, is_active, created_at }
// — no `name` or `plan` fields, which several existing components expect.
// Normalize here once instead of touching every component.
function normalizeUser(backendUser) {
  if (!backendUser) return null;
  return {
    ...backendUser,
    name: backendUser.full_name || backendUser.email.split('@')[0],
    plan: 'Starter', // the backend has no billing/plan concept yet
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On load, if we have a stored JWT, ask the backend who it belongs to.
    // If the token is missing/expired, fall back to logged-out silently.
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser();
        setUser(normalizeUser(currentUser));
      } catch {
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    await loginUser({ email, password });
    const currentUser = await fetchCurrentUser();
    setUser(normalizeUser(currentUser));
    return currentUser;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    await registerUser({ name, email, password });
    // Registration doesn't log the user in by itself — sign in right after.
    await loginUser({ email, password });
    const currentUser = await fetchCurrentUser();
    setUser(normalizeUser(currentUser));
    return currentUser;
  }, []);

  // The backend has no Google OAuth endpoint yet. Keep the function so the
  // existing Login/Signup buttons don't crash, but be honest that it's not wired up.
  const loginWithGoogle = useCallback(async () => {
    throw new Error("Google sign-in isn't connected to the backend yet.");
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  // The backend has no PATCH/PUT /auth/me endpoint yet, so there's nowhere
  // to actually save profile edits. Surface that clearly instead of pretending
  // it worked (Settings.jsx already catches and toasts this).
  const updateProfile = useCallback(() => {
    throw new Error("Profile editing isn't supported by the backend yet.");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
