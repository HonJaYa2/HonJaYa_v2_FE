import { useState, useEffect } from 'react';
import { getParsedCookies } from './auth';

const useAuthCookies = () => {
  const [cookies, setCookies] = useState(getParsedCookies());

  useEffect(() => {
    const parsedCookies = getParsedCookies();
    setCookies(parsedCookies);
    console.log('Cookies:', parsedCookies); // 쿠키 확인
  }, []);

  return cookies;
};

export default useAuthCookies;
