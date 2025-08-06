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
    console.log('Auth query fulfilled:', data);
    if (data.accessToken) {
      dispatch(setCredentials({
        token: data.accessToken,       
      }));
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
};
