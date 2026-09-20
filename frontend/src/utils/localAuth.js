// Client-side authentication for VisionX.
// There is no backend yet, so accounts are stored in the browser's localStorage.
// Passwords are hashed with SHA-256 (Web Crypto) before storage — never stored in plain text.
// This is fine for a local/demo app; swap this module out once a real backend exists.

const USERS_KEY = 'visionx_users';
const SESSION_KEY = 'visionx_session';

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function signUp({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await sha256(password);
  const user = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    plan: 'Starter',
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);
  setSession(user.id);
  return toPublicUser(user);
}

export async function signIn({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error('No account found with this email.');
  }

  const passwordHash = await sha256(password);
  if (passwordHash !== user.passwordHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  setSession(user.id);
  return toPublicUser(user);
}

export function setSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, since: Date.now() }));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = readUsers();
  const user = users.find((u) => u.id === session.userId);
  return toPublicUser(user);
}

export function updateUser(userId, updates) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('User not found.');
  users[index] = { ...users[index], ...updates };
  writeUsers(users);
  return toPublicUser(users[index]);
}

/**
 * Signs in (or silently creates) a local account from a real Google profile
 * — matched by Google account ID first, then by email, so a person who
 * originally signed up with a password can still link their Google account.
 */
export function signInWithGoogleProfile({ googleId, name, email, picture }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  let index = users.findIndex((u) => u.googleId === googleId || u.email === normalizedEmail);

  if (index === -1) {
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email: normalizedEmail,
      googleId,
      picture,
      provider: 'google',
      plan: 'Starter',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    index = users.length - 1;
  } else {
    users[index] = {
      ...users[index],
      googleId,
      picture: picture || users[index].picture,
      name: users[index].name || name,
    };
  }

  writeUsers(users);
  setSession(users[index].id);
  return toPublicUser(users[index]);
}
