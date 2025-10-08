import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { handleAuthUser } from "../services/userServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getSession = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error);
        throw error;
      }
      
      if (session?.user) {
        setAuthUser(session.user);
        
        const userProfile = await handleAuthUser(session.user);
        
        if (userProfile) {
          setCurrentUser(userProfile);
          setIsAuthenticated(true);
        }
        return;
      }
      
      // Handle OAuth redirect
      const { data: urlSession } = await supabase.auth.getSessionFromUrl();
      
      if (urlSession?.user) {
        setAuthUser(urlSession.user);
        
        const userProfile = await handleAuthUser(urlSession.user);
        
        if (userProfile) {
          setCurrentUser(userProfile);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error in getSession:', error);
      // toast.error('Session expired, please sign in again');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setAuthUser(null);
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  useEffect(() => {
      getSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        isLoading,
        authUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
