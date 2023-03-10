import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { User } from '../types/User';

export const useLogout = () => {
  const logout = () => {
    Cookies.remove('user');
  };

  return { logout };
};

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileState = /iphone|ipad|ipod|android/i.test(userAgent);
    setIsMobile(isMobileState);
  }, []);

  return isMobile;
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser: string | undefined = Cookies.get('user');

    if (currentUser) {
      const userData = <User>jwtDecode(currentUser);

      if (userData) {
        setUser(userData);
      }
    }
  }, []);

  return user;
};
