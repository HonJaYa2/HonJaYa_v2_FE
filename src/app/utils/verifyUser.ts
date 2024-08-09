'use client';

import Cookies from 'js-cookie';

export const verifyUser = (): boolean => {
  const token = Cookies.get('token');
  const user = Cookies.get('user');
  console.log('Token:', token);
  console.log('User:', user);
  if (!token || !user) {
    Cookies.remove('token');
    Cookies.remove('user');
    return false;
  }
  return true;
};

export const getUserId = (): string | null => {
  const user = Cookies.get('user');
  if (user) {
    try {
      const userObj = JSON.parse(user);
      return userObj.id;
    } catch (e) {
      console.error('Failed to parse user cookie:', e);
      return null;
    }
  }
  return null;
};
