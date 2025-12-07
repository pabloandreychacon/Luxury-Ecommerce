import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfigfcufbornekzjxbqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWdmY3VmYm9ybmVremp4YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDU4NDcsImV4cCI6MjA2ODQ4MTg0N30.Y40XGZS1wvUVku4kEKi5CpntHA3k8Y9ohzMSG9bNMHI';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      Profiles: {
        Row: {
          Id: number;
          Email: string;
          FullName: string | null;
          PasswordHash: string;
          Phone: string | null;
          Address: string | null;
          CreatedAt: string;
          UpdatedAt: string;
        };
        Insert: {
          Id?: number;
          Email: string;
          FullName?: string | null;
          PasswordHash: string;
          Phone?: string | null;
          Address?: string | null;
          CreatedAt?: string;
          UpdatedAt?: string;
        };
        Update: {
          Email?: string;
          FullName?: string | null;
          PasswordHash?: string;
          Phone?: string | null;
          Address?: string | null;
          UpdatedAt?: string;
        };
      };
    };
  };
};
