import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock user data for testing
  const mockUsers = [
    {
      uid: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      membershipStatus: 'active'
    },
    {
      uid: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      membershipStatus: 'inactive'
    }
  ];

  async function signup(email, password, userData) {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser = {
        uid: Date.now().toString(),
        email,
        ...userData,
        membershipStatus: 'inactive'
      };

      setCurrentUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }

  function login(email, password) {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
        setLoading(false);
      }, 1000);
    });
  }

  function logout() {
    setCurrentUser(null);
    return Promise.resolve();
  }

  async function updateMembershipStatus(userId, status) {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        membershipStatus: status
      });
    }
    return Promise.resolve();
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateMembershipStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 