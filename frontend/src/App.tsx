import React, { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes.js';
import { useAppDispatch } from './store/index.js';
import { fetchCurrentUser } from './store/slices/authSlice.js';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('cc_access_token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
