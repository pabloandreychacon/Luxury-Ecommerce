import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../lib/types';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const { data, error: fetchError } = await supabase
            .from('Profiles')
            .select('*')
            .eq('Id', storedUserId);

          if (fetchError) {
            console.error('Profile fetch error:', fetchError);
            localStorage.removeItem('userId');
            setState(prev => ({ ...prev, loading: false }));
            return;
          }

          if (data && data.length > 0) {
            const profileData = data[0];
            setState(prev => ({
              ...prev,
              user: {
                id: profileData.Id,
                email: profileData.Email,
                firstName: profileData.FullName || '',
                lastName: '',
                createdAt: profileData.CreatedAt,
              } as User,
              loading: false
            }));
          } else {
            localStorage.removeItem('userId');
            setState(prev => ({ ...prev, loading: false }));
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Query Profiles table for user by email
      const { data, error: fetchError } = await supabase
        .from('Profiles')
        .select('*')
        .eq('Email', normalizedEmail);

      if (fetchError) {
        console.error('Profile fetch error:', fetchError);
        throw new Error('Failed to load profile. Please try again.');
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid email or password. Please try again.');
      }

      const profileData = data[0];

      // Compare password with stored hash
      const passwordMatch = await bcrypt.compare(password, profileData.PasswordHash);

      if (!passwordMatch) {
        throw new Error('Invalid email or password. Please try again.');
      }

      // Login successful - store userId in localStorage
      localStorage.setItem('userId', profileData.Id);

      setState(prev => ({
        ...prev,
        user: {
          id: profileData.Id,
          email: profileData.Email,
          firstName: profileData.FullName || '',
          lastName: '',
          createdAt: profileData.CreatedAt,
        } as User,
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Validate inputs
      if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('Profiles')
        .select('Email')
        .eq('Email', normalizedEmail);

      if (checkError) {
        console.error('Check email error:', checkError);
        throw new Error('Failed to check email. Please try again.');
      }

      if (existingUser && existingUser.length > 0) {
        throw new Error('This email is already registered. Please sign in or use a different email.');
      }

      // Hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Combine first and last name into FullName
      const fullName = `${firstName} ${lastName}`.trim();

      // Insert profile with hashed password
      const { data, error: profileError } = await supabase
        .from('Profiles')
        .insert([{
          Email: normalizedEmail,
          FullName: fullName,
          PasswordHash: passwordHash,
        }])
        .select();

      if (profileError) {
        console.error('Profile insert error:', profileError);
        throw new Error('Failed to create account. Please try again.');
      }

      if (data && data.length > 0) {
        const profileData = data[0];

        // Store userId in localStorage
        localStorage.setItem('userId', profileData.Id);

        setState(prev => ({
          ...prev,
          user: {
            id: profileData.Id,
            email: profileData.Email,
            firstName: profileData.FullName || '',
            lastName: '',
            createdAt: profileData.CreatedAt,
          } as User,
          loading: false
        }));
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Clear localStorage
      localStorage.removeItem('userId');
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
