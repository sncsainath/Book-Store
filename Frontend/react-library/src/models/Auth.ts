// auth.ts
import { OktaAuth } from '@okta/okta-auth-js';
import { oktaConfig } from '../lib/oktaConfig';


const oktaAuth = new OktaAuth(oktaConfig);

export async function login() {
  await oktaAuth.signInWithRedirect();
}

export async function handleAuthentication() {
  try {
    await oktaAuth.handleLoginRedirect();
  } catch (error) {
    console.error('Error handling authentication', error);
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const authState = await oktaAuth.authStateManager.updateAuthState();
  return !!authState.isAuthenticated;
}

export function logout() {
  oktaAuth.signOut();
}

export { oktaAuth };
