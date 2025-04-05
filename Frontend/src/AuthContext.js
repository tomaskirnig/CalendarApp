import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userID, setUserId] = useState(localStorage.getItem('user_id'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));

  useEffect(() => {
    localStorage.setItem('user_id', userID);
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_role', userRole);
  }, [userID, userName, userRole]);

  const login = (id, name, role) => {
    setUserId(id);
    setUserName(name);
    setUserRole(role);
  };

  const logout = () => {
    window.location.href = 'http://localhost:3000/login';
    setUserId(null);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userID, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
