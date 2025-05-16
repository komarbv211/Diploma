// handleAuthQueryStarted.ts
import type { Dispatch } from '@reduxjs/toolkit';
import type { IAuthResponse } from '../types/account';
import { setCredentials } from '../store/slices/userSlice';

export const handleAuthQueryStarted = async (
  _arg: unknown,
  {
    dispatch,
    queryFulfilled,
  }: {
    dispatch: Dispatch;
    queryFulfilled: Promise<{ data: IAuthResponse }>;
  }
) => {
  try {
    const { data } = await queryFulfilled;
    if (data.accessToken) {
      dispatch(setCredentials({
        token: data.accessToken,
        refreshToken: data.refreshToken,
      }));
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
};
