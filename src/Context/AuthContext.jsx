import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Sync with localStorage on mount
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';

    if (token) {
      setAuthUser({
        token,
        name: userName || 'User',
        email: userEmail || '',
      });
      setIsAdmin(adminStatus);
    }
  }, []);

  const loginUser = (userData) => {
    setAuthUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    if (userData.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
    }
  };

  const logoutUser = () => {
    setAuthUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
  };

  const promoteToAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isAdmin,
        loginUser,
        logoutUser,
        promoteToAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
