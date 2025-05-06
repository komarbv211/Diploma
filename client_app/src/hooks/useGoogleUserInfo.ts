// useGoogleUserInfo.ts
import { useState, useEffect } from 'react';
import { GoogleProfile } from '../types/account';
import { APP_ENV } from '../env';

export const useGoogleUserInfo = (token: string | null) => {
  const [userInfo, setUserInfo] = useState<GoogleProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

        try {
            const response = await fetch(`${APP_ENV.GOOGLE_USERINFO_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не вдалося отримати інформацію про користувача');
            }

            const data: GoogleProfile = await response.json();
            setUserInfo(data);
        } catch (err: unknown) { 
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Невідома помилка');
            }
        } finally {
            setLoading(false);
        }
    };

    fetchUserInfo();
  }, [token]);

  return { userInfo, loading, error };
};
