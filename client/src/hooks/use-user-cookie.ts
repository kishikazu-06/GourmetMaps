import { useEffect, useState } from 'react';
import { getCookie, setCookie, generateUserCookie } from '@/lib/cookies';

export function useUserCookie() {
  const [userCookie, setUserCookie] = useState<string>('');

  useEffect(() => {
    let cookie = getCookie('user_cookie');
    if (!cookie) {
      cookie = generateUserCookie();
      setCookie('user_cookie', cookie);
    }
    setUserCookie(cookie);
  }, []);

  return userCookie;
}
