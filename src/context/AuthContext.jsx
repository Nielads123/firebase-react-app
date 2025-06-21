import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../Firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(newEmail) {
    if (auth.currentUser) {
      return firebaseUpdateEmail(auth.currentUser, newEmail);
    }
    return Promise.reject(new Error("No user logged in"));
  }

  function updatePassword(newPassword) {
    if (auth.currentUser) {
      return firebaseUpdatePassword(auth.currentUser, newPassword);
    }
    return Promise.reject(new Error("No user logged in"));
  }

  // ✅ Add this to support UpdateProfile
  function reAuthenticate(currentPassword) {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error("No user logged in"));

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    resetPassword,
    updateEmail,
    updatePassword,
    reAuthenticate, // 👈 Include this in the context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
