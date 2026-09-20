// Real Google Sign-In using Google Identity Services (GSI) — Google's official
// client-side library. This decodes the ID token Google issues after the user
// signs in, entirely in the browser (no backend required for this demo build).
//
// To enable it, create an OAuth Client ID at https://console.cloud.google.com/apis/credentials
// (Application type: "Web application", with this app's URL under
// "Authorized JavaScript origins"), then put it in your .env file as:
//   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function isGoogleConfigured() {
  return Boolean(CLIENT_ID);
}

function decodeJwt(token) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
  return JSON.parse(decoded);
}

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.getElementById('google-identity-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Could not load Google Sign-In.')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Google Sign-In.'));
    document.head.appendChild(script);
  });
}

/**
 * Opens the real Google Sign-In flow and resolves with the signed-in
 * person's real profile: { googleId, name, email, picture }.
 */
export async function signInWithGoogle() {
  if (!isGoogleConfigured()) {
    throw new Error(
      'Google Sign-In needs a Client ID. Add VITE_GOOGLE_CLIENT_ID to your .env file — see src/utils/googleAuth.js for setup steps.'
    );
  }

  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          try {
            const profile = decodeJwt(response.credential);
            resolve({
              googleId: profile.sub,
              name: profile.name,
              email: profile.email,
              picture: profile.picture,
            });
          } catch (err) {
            reject(err);
          }
        },
        auto_select: false,
      });

      // Google's One Tap / account chooser prompt — the real sign-in UI Google renders.
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google Sign-In was closed before completing.'));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
