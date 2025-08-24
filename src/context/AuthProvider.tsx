'use client';

import { getProfileAction } from '@/app/[locale]/(auth)/action';
import Loading from '@/app/loading';
import { IDataApiResponse, IProfile } from '@/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  profile: IProfile | null;
  loading: boolean;
  signIn: (profile: IProfile) => void;
  signOut: () => void;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const data = await getProfileAction();
      if (data.success) {
        const profile = (data as IDataApiResponse<IProfile>).data;
        setProfile(profile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };
    fetchProfile();
  }, []);

  const signIn = (profile: IProfile) => {
    setProfile(profile);
  };

  const signOut = () => {
    setProfile(null);
  };

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ profile, loading, signIn, signOut, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
