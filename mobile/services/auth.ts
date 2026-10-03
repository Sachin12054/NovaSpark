import { auth } from './firebase';
import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

export async function signInAnonymousStudent(): Promise<User | null> {
  try {
    if (!auth) return null;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    return null;
  }
}

export async function registerWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    if (!auth) return null;
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error) {
    return null;
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    if (!auth) return null;
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error) {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    if (!auth) return;
    await signOut(auth);
  } catch (e) {}
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  try {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  } catch (e) {
    callback(null);
    return () => {};
  }
}

export function getCurrentFirebaseUser(): User | null {
  try {
    return auth ? auth.currentUser : null;
  } catch {
    return null;
  }
}
