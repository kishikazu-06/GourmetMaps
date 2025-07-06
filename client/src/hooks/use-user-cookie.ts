import { useEffect, useState } from 'react';
import { getCookie, setCookie, generateUserCookie } from '@/lib/cookies';

let globalUserCookie: string | null = null;

export function useUserCookie() {
  const [userCookie, setUserCookie] = useState<string>('');

  useEffect(() => {
    if (globalUserCookie) {
      setUserCookie(globalUserCookie);
      return;
    }

    let cookie = getCookie('user_cookie');
    if (!cookie) {
      cookie = generateUserCookie();
      setCookie('user_cookie', cookie);
    }
    globalUserCookie = cookie;
    setUserCookie(cookie);
  }, []);

  return userCookie;
}
