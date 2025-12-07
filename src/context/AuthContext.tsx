import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../lib/types';
import { supabase } from '../lib/supabase';

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
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('Profiles')
            .select('*')
            .eq('Id', session.user.id)
            .single();

          if (data) {
            setState(prev => ({
              ...prev,
              user: {
                id: data.Id,
                email: data.Email,
                firstName: data.FullName || '',
                lastName: '',
                createdAt: data.CreatedAt,
              } as User,
              loading: false
            }));
          } else {
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (authUser) {
        const { data } = await supabase
          .from('Profiles')
          .select('*')
          .eq('Id', authUser.id)
          .single();

        if (data) {
          setState(prev => ({
            ...prev,
            user: {
              id: data.Id,
              email: data.Email,
              firstName: data.FullName || '',
              lastName: '',
              createdAt: data.CreatedAt,
            } as User,
            loading: false
          }));
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (authUser) {
        // Combine first and last name into FullName
        const fullName = `${firstName} ${lastName}`.trim();

        const { data, error: profileError } = await supabase
          .from('Profiles')
          .insert([{
            Id: authUser.id,
            Email: email,
            FullName: fullName,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
          }])
          .select()
          .single();

        if (profileError) throw profileError;

        if (data) {
          setState(prev => ({
            ...prev,
            user: {
              id: data.Id,
              email: data.Email,
              firstName: data.FullName || '',
              lastName: '',
              createdAt: data.CreatedAt,
            } as User,
            loading: false
          }));
        }
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
      await supabase.auth.signOut();
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
