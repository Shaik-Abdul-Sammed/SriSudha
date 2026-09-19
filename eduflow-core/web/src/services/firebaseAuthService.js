// Firebase Authentication Service
// Provides secure authentication with email/password, social login, and role management

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { auth, logCustomEvent } from './firebaseConfig';
import { createUserProfile, updateUserProfile } from './firestoreService';

class FirebaseAuthService {
  // Sign up with email and password
  async signUp(email, password, displayName, role = 'student') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      await createUserProfile({
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true
      });

      // Log event
      logCustomEvent('user_signup', { role, email });

      return {
        uid: user.uid,
        email: user.email,
        displayName,
        role
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await updateUserProfile(user.uid, { lastLogin: new Date() });

      logCustomEvent('user_signin', { email });

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut() {
    try {
      logCustomEvent('user_signout', {});
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      logCustomEvent('password_reset_requested', { email });
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update email
  async updateUserEmail(newEmail) {
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        await updateUserProfile(auth.currentUser.uid, { email: newEmail });
        logCustomEvent('email_updated', {});
        return true;
      }
    } catch (error) {
      console.error('Email update error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update password
  async updateUserPassword(newPassword) {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        logCustomEvent('password_updated', {});
        return true;
      }
    } catch (error) {
      console.error('Password update error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Handle auth errors
  handleAuthError(error) {
    const errorMap = {
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/invalid-email': 'Invalid email address',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Wrong password',
      'auth/too-many-requests': 'Too many login attempts. Try again later.',
    };

    return new Error(errorMap[error.code] || error.message);
  }
}

export default new FirebaseAuthService();
